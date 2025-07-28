// Google Apps Script code (paste this in script.google.com)
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()

    if (data.action === "addUser") {
      const row = [
        data.data.timestamp,
        data.data.name,
        data.data.email,
        data.data.type,
        data.data.details,
        data.data.ip,
      ]

      sheet.appendRow(row)

      return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(
        ContentService.MimeType.JSON,
      )
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() })).setMimeType(
      ContentService.MimeType.JSON,
    )
  }
}

function doGet() {
  return ContentService.createTextOutput("Google Apps Script is working!").setMimeType(ContentService.MimeType.TEXT)
}

// Declare SpreadsheetApp and ContentService
var SpreadsheetApp
var ContentService
