/**
 * AI Academy — No-Code AI Automation Certification Exam
 * Google Apps Script web app: receives one submission per candidate and
 * appends it to the Results sheet.
 *
 * DEPLOY
 *   1. Set SPREADSHEET_ID below (see the note on it).
 *   2. Deploy → New deployment → Web app
 *        Execute as:      Me
 *        Who has access:  Anyone
 *   3. Copy the /exec URL into CONFIG.WEBHOOK_URL in index.html.
 *   4. Open the /exec URL in a browser — it should say the endpoint is live.
 *
 * AFTER ANY EDIT you must Deploy → Manage deployments → edit → Version: New
 * version → Deploy. Saving the code alone does NOT update the live web app.
 * This is the single most common reason a working script still records nothing.
 */

/**
 * Paste the spreadsheet id between the quotes — it is the long string in the
 * sheet's own URL, between /d/ and /edit.
 *
 * Leave it as "" ONLY if this script lives inside the spreadsheet itself
 * (opened via Extensions → Apps Script from the sheet). A standalone script
 * created from script.google.com has no active spreadsheet, so
 * getActiveSpreadsheet() returns null and every submission fails silently.
 */
var SPREADSHEET_ID = "";

var SHEET_NAME = "Results";

var HEADERS = [
  "Submitted", "Name", "Email", "Score", "Total", "Percentage", "Result",
  "Answered", "Time used", "Violations", "Status", "Topic breakdown",
  "Violation log", "Answers"
];

function book_() {
  if (SPREADSHEET_ID) return SpreadsheetApp.openById(SPREADSHEET_ID);
  var active = SpreadsheetApp.getActiveSpreadsheet();
  if (!active) {
    throw new Error(
      "No spreadsheet. This script is standalone — set SPREADSHEET_ID at the " +
      "top of the file to the id of your results sheet."
    );
  }
  return active;
}

function sheet_() {
  var ss = book_();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);          // create it rather than fail
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json_({ ok: false, error: "empty request body" });
    }
    var d = JSON.parse(e.postData.contents);

    var topics = Object.keys(d.byTopic || {}).map(function (t) {
      return t + ": " + d.byTopic[t].c + "/" + d.byTopic[t].t;
    }).join(" | ");

    var log = (d.violationLog || []).map(function (v) {
      return "[" + v.elapsed + "] " + v.type;
    }).join(" | ");

    sheet_().appendRow([
      d.submittedAt ? new Date(d.submittedAt) : new Date(),
      d.name || "", d.email || "",
      d.score, d.total, d.percentage,
      d.passed ? "PASS" : "FAIL",
      d.answered, d.timeUsed, d.violations, d.status,
      topics, log,
      JSON.stringify(d.answers || [])
    ]);

    return json_({ ok: true, recorded: d.email || "" });
  } catch (err) {
    // Keep a trace where you can actually see it: Apps Script → Executions
    console.error("exam submission failed: " + err);
    return json_({ ok: false, error: String(err) });
  }
}

/** Health check — open the /exec URL in a browser to confirm the deployment. */
function doGet() {
  var status, detail;
  try {
    var sh = sheet_();
    status = "ok";
    detail = "Writing to \"" + sh.getParent().getName() + "\" → " + SHEET_NAME +
             ". Rows so far: " + Math.max(0, sh.getLastRow() - 1) + ".";
  } catch (err) {
    status = "misconfigured";
    detail = String(err);
  }
  return HtmlService.createHtmlOutput(
    "<html><body style=\"font:16px system-ui;padding:40px;max-width:44em\">" +
    "<h2>AI Academy exam endpoint — " + status + "</h2>" +
    "<p>" + detail + "</p>" +
    "<p style=\"color:#666\">This endpoint accepts exam submissions by POST. " +
    "Seeing this page means the deployment is live and publicly reachable.</p>" +
    "</body></html>"
  );
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run this once from the editor (Run → testSubmission) to prove the script can
 * write to the sheet. A row named "Test Candidate" should appear. Delete it
 * afterwards.
 */
function testSubmission() {
  var fake = {
    postData: {
      contents: JSON.stringify({
        name: "Test Candidate", email: "test@example.com",
        score: 42, total: 50, percentage: 84, passed: true,
        answered: 50, timeUsed: "31:12", violations: 0,
        status: "Submitted by candidate",
        submittedAt: new Date().toISOString(),
        byTopic: { "n8n": { c: 9, t: 11 }, "Prompt Engineering": { c: 13, t: 14 } },
        violationLog: [], answers: []
      })
    }
  };
  Logger.log(doPost(fake).getContent());
}
