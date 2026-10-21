/**
 * LTX Sales Deck — access codes, lead capture, and session tracking.
 * Public web app endpoint. JSON in, JSON out.
 *
 * Lead form posts { op, data }. Tracker posts a payload with sessionId.
 * GET is a health check only.
 *
 * Redeploy: Deploy → Manage deployments → pencil → Version: New version.
 * Do not create a new deployment — that mints a different URL.
 */

var CONFIG = {
  SPREADSHEET_ID: '1811-7KXo8Ak3UVtG-rHcwqiH65r_jTBV7mGe370NqFU',
  LEADS_SHEET: 'Leads',
  CODES_SHEET: 'Codes',
  SESSIONS_SHEET: 'deck_sessions',
  LEADS_HEADERS: ['Timestamp', 'First name', 'Last name', 'Role', 'Code'],
  MAX: {
    name: 60,
    role: 80,
    code: 32,
    company: 120,
    sessionId: 80,
    deckId: 64,
    tz: 60,
    fp: 40,
    referrer: 200,
    utm: 200,
    viewport: 32,
    device: 40,
    json: 45000
  }
};

var SESSION_HEADERS = [
  'sessionId', 'deckId', 'linkId', 'firstName', 'lastName', 'role',
  'startedAt', 'lastSeenAt', 'activeMs', 'wallMs', 'reach', 'slideCount',
  'deviceType', 'os', 'browser', 'viewport', 'fullscreen', 'tz',
  'fp', 'referrer', 'utm', 'final', 'slidesJson', 'pathJson', 'eventsJson'
];

var STRIP_FROM_TEXT = /[^\p{L}\p{M} '\-]/gu;
var STRIP_FROM_CODE = /[^A-Z0-9\-]/g;
var STRIP_FROM_ID = /[^a-zA-Z0-9._-]/g;

function clean_(value, stripPattern, maxLen) {
  return String(value == null ? '' : value)
    .normalize('NFC')
    .replace(stripPattern, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

function cleanText_(value, maxLen) {
  return clean_(value, STRIP_FROM_TEXT, maxLen);
}

function cleanCode_(value) {
  return clean_(
    String(value == null ? '' : value).toUpperCase(),
    STRIP_FROM_CODE,
    CONFIG.MAX.code
  );
}

function clip_(value, maxLen) {
  return String(value == null ? '' : value).slice(0, maxLen);
}

function formulaSafe_(value) {
  var s = String(value == null ? '' : value);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function num_(value) {
  var n = Number(value);
  if (!isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

function jsonCell_(value) {
  var s = JSON.stringify(value == null ? null : value);
  if (s.length > CONFIG.MAX.json) s = JSON.stringify({ truncated: true });
  return formulaSafe_(s);
}

function ss_() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID')
    || CONFIG.SPREADSHEET_ID;
  return SpreadsheetApp.openById(id);
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function findCode_(code) {
  if (!code) return null;

  var sheet = ss_().getSheetByName(CONFIG.CODES_SHEET);
  if (!sheet) return null;

  var rows = sheet.getDataRange().getValues();

  for (var i = 1; i < rows.length; i++) {
    if (cleanCode_(rows[i][0]) === code) {
      return {
        company: cleanText_(rows[i][1], CONFIG.MAX.company)
      };
    }
  }

  return null;
}

function appendLead_(lead) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    var spreadsheet = ss_();
    var sheet = spreadsheet.getSheetByName(CONFIG.LEADS_SHEET)
      || spreadsheet.insertSheet(CONFIG.LEADS_SHEET);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(CONFIG.LEADS_HEADERS);
    }

    sheet.appendRow([
      new Date(),
      formulaSafe_(lead.firstName),
      formulaSafe_(lead.lastName),
      formulaSafe_(lead.role),
      formulaSafe_(lead.code)
    ]);
  } finally {
    lock.releaseLock();
  }
}

var OPS = {
  ping: function () {
    return { ok: true };
  },

  checkCode: function (data) {
    var code = cleanCode_(data.code);
    var match = findCode_(code);

    if (!match) {
      return { ok: false, error: 'invalid_code' };
    }

    return {
      ok: true,
      company: match.company
    };
  },

  submitLead: function (data) {
    var lead = {
      firstName: cleanText_(data.firstName, CONFIG.MAX.name),
      lastName: cleanText_(data.lastName, CONFIG.MAX.name),
      role: cleanText_(data.role, CONFIG.MAX.role),
      code: cleanCode_(data.code)
    };

    if (!lead.firstName || !lead.lastName) {
      return { ok: false, error: 'missing_name' };
    }

    var match = findCode_(lead.code);

    if (!match) {
      return { ok: false, error: 'invalid_code' };
    }

    appendLead_(lead);

    return {
      ok: true,
      company: match.company
    };
  }
};

function route_(op, data) {
  try {
    var handler = Object.prototype.hasOwnProperty.call(OPS, op)
      ? OPS[op]
      : null;

    if (!handler) {
      return json_({ ok: false, error: 'unknown_op' });
    }

    return json_(handler(data || {}));
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server_error' });
  }
}

function getSessionsSheet_() {
  var spreadsheet = ss_();
  var sheet = spreadsheet.getSheetByName(CONFIG.SESSIONS_SHEET);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.SESSIONS_SHEET);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(SESSION_HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function normalizeSession_(d) {
  d = d || {};
  var dev = d.device || {};
  return {
    sessionId: clip_(d.sessionId, CONFIG.MAX.sessionId),
    deckId: clean_(d.deckId, STRIP_FROM_ID, CONFIG.MAX.deckId),
    linkId: cleanCode_(d.linkId),
    firstName: cleanText_(d.firstName, CONFIG.MAX.name),
    lastName: cleanText_(d.lastName, CONFIG.MAX.name),
    role: cleanText_(d.role, CONFIG.MAX.role),
    startedAt: clip_(d.startedAt, 40),
    sentAt: clip_(d.sentAt, 40) || new Date().toISOString(),
    activeMs: num_(d.activeMs),
    wallMs: num_(d.wallMs),
    reach: num_(d.reach),
    slideCount: num_(d.slideCount),
    deviceType: clip_(dev.type, CONFIG.MAX.device),
    os: clip_(dev.os, CONFIG.MAX.device),
    browser: clip_(dev.browser, CONFIG.MAX.device),
    viewport: clip_(dev.viewport, CONFIG.MAX.viewport),
    fullscreen: !!dev.fullscreen,
    tz: clip_(d.tz, CONFIG.MAX.tz),
    fp: clip_(d.fp, CONFIG.MAX.fp),
    referrer: clip_(d.referrer, CONFIG.MAX.referrer),
    utm: clip_(d.utm, CONFIG.MAX.utm),
    final: !!d.final,
    slides: d.slides && typeof d.slides === 'object' ? d.slides : {},
    path: d.path instanceof Array ? d.path : [],
    events: d.events instanceof Array ? d.events : []
  };
}

function buildSessionRow_(s) {
  return [
    formulaSafe_(s.sessionId),
    formulaSafe_(s.deckId),
    formulaSafe_(s.linkId),
    formulaSafe_(s.firstName),
    formulaSafe_(s.lastName),
    formulaSafe_(s.role),
    formulaSafe_(s.startedAt),
    formulaSafe_(s.sentAt),
    s.activeMs,
    s.wallMs,
    s.reach,
    s.slideCount,
    formulaSafe_(s.deviceType),
    formulaSafe_(s.os),
    formulaSafe_(s.browser),
    formulaSafe_(s.viewport),
    s.fullscreen ? 'yes' : '',
    formulaSafe_(s.tz),
    formulaSafe_(s.fp),
    formulaSafe_(s.referrer),
    formulaSafe_(s.utm),
    s.final ? 'yes' : '',
    jsonCell_(s.slides),
    jsonCell_(s.path),
    jsonCell_(s.events)
  ];
}

function findRowBySessionId_(sheet, sessionId) {
  if (!sessionId) return -1;
  var last = sheet.getLastRow();
  if (last < 2) return -1;
  var ids = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (var i = ids.length - 1; i >= 0; i--) {
    if (ids[i][0] === sessionId) return i + 2;
  }
  return -1;
}

function handleTrackerPost_(data) {
  var session = normalizeSession_(data);
  if (!session.sessionId) return json_({ ok: false, error: 'bad_session' });

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return json_({ ok: false, error: 'busy' });

  var notify = null;
  try {
    var sheet = getSessionsSheet_();
    var row = buildSessionRow_(session);
    var rowIndex = findRowBySessionId_(sheet, formulaSafe_(session.sessionId));

    if (rowIndex > 0) {
      sheet.getRange(rowIndex, 1, 1, SESSION_HEADERS.length).setValues([row]);
    } else {
      var prior = countPriorSessions_(session.linkId, session.fp);
      sheet.appendRow(row);
      notify = { session: session, prior: prior };
    }
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server_error' });
  } finally {
    lock.releaseLock();
  }

  if (notify) notifyNewSession_(notify.session, notify.prior);
  return json_({ ok: true });
}

function notifyNewSession_(s, prior) {
  var url = PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK');
  if (!url) return;

  prior = prior || { sameLink: 0, sameDevice: 0 };
  var who = (s.firstName + ' ' + s.lastName).trim() || 'Unknown viewer';
  var headline = prior.sameDevice > 0
    ? who + ' re-opened the deck'
    : prior.sameLink > 0
      ? 'Deck opened on a new device — ' + (s.linkId || 'no code') + ' may have been forwarded'
      : who + ' opened the deck';

  var lines = [
    '*' + headline + '*',
    (s.role ? s.role + ' · ' : '') + 'code `' + (s.linkId || '—') + '`',
    prior.sameLink > 0 ? 'Session ' + (prior.sameLink + 1) + ' for this code' : 'First open'
  ];

  try {
    UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ text: lines.join('\n') }),
      muteHttpExceptions: true
    });
  } catch (err) { /* alerting must never block the write */ }
}

function countPriorSessions_(linkId, fp) {
  var out = { sameLink: 0, sameDevice: 0 };
  if (!linkId) return out;
  var sheet = getSessionsSheet_();
  var last = sheet.getLastRow();
  if (last < 2) return out;

  var cols = sheet.getRange(2, 1, last - 1, SESSION_HEADERS.length).getValues();
  var linkCol = SESSION_HEADERS.indexOf('linkId');
  var fpCol = SESSION_HEADERS.indexOf('fp');
  var link = formulaSafe_(linkId);
  var device = formulaSafe_(fp);
  cols.forEach(function (r) {
    if (r[linkCol] === link) {
      out.sameLink++;
      if (r[fpCol] === device) out.sameDevice++;
    }
  });
  return out;
}

function doPost(e) {
  var body;

  try {
    body = JSON.parse(
      (e && e.postData && e.postData.contents) || '{}'
    );
  } catch (err) {
    return json_({ ok: false, error: 'bad_json' });
  }

  // Tracker payloads are { sessionId, ... } with no `op`.
  // Lead form is { op, data } and must not fall into the session writer.
  if (body && typeof body.sessionId === 'string' && body.sessionId && !body.op) {
    return handleTrackerPost_(body);
  }

  return route_(body.op, body.data);
}

function doGet() {
  return json_({ ok: true });
}
