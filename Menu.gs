/** @OnlyCurrentDoc */
function addLeader() {
  var ui = SpreadsheetApp.getUi();
  try {
    var output = HtmlService.createHtmlOutputFromFile('Add_Leader_Sidebar');
    ui.showSidebar(output);
    updateCondFormatting();
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName('How To Setup').hideSheet();
  }
  catch(err) {
    Logger.log(err);
  }
}

function removeLeader() {
  var ui = SpreadsheetApp.getUi();
  if (getLeaders().length > 0) {
    try {
      var output = HtmlService.createHtmlOutputFromFile('Remove_Leader_Sidebar');
      ui.showSidebar(output);
      updateCondFormatting();
    }
    catch(err) {
      Logger.log(err);
    }
  } else {
    ui.alert("There are no emails on the list")
  }
}


function addEmail() {
  var ui = SpreadsheetApp.getUi();
  try {
    var output = HtmlService.createHtmlOutputFromFile('Add_Email_Sidebar');
    ui.showSidebar(output);
  }
  catch(err) {
    Logger.log(err);
  }
}

function removeEmail() {
  var ui = SpreadsheetApp.getUi();
  if (getEmails().length > 0) {
    try {
      var output = HtmlService.createHtmlOutputFromFile('Remove_Email_Sidebar');
      ui.showSidebar(output);
    }
    catch(err) {
      Logger.log(err);
    }
  } else {
    ui.alert("There are no emails on the list")
  }
}


function setup() {
  var triggers = ScriptApp.getProjectTriggers();
  if(triggers.length == 0){
    // Create and link form
    var ui = SpreadsheetApp.getUi();
    try {
      var output = HtmlService.createHtmlOutputFromFile('New_Sheet_Sidebar');
      ui.showSidebar(output);
    }
    catch(err) {
      Logger.log(err);
    }

    // Set up triggers
    ScriptApp.newTrigger('sendDailyEmails')
      .timeBased()
      .everyDays(1)
      .atHour(8)
      .create();
    ScriptApp.newTrigger('sendWeeklyEmails')
      .timeBased()
      .everyWeeks(1)
      .onWeekDay(ScriptApp.WeekDay.SUNDAY)
      .atHour(8)
      .create();
    ScriptApp.newTrigger('processData')
      .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
      .onFormSubmit()
      .create();
    var targetDate = new Date();
    targetDate.setHours(8,0,0,0);
    if (targetDate.getMonth() < 4) targetDate.setMonth(3,1);
    else targetDate.setFullYear(targetDate.getFullYear()+1,3,1);
    ScriptApp.newTrigger('yearlyFreshmanUpdate')
      .timeBased()
      .at(targetDate)
      .create();
    targetDate = new Date();
    targetDate.setHours(8,0,0,0);
    if (targetDate.getMonth() < 6) targetDate.setMonth(5,1);
    else targetDate.setFullYear(targetDate.getFullYear()+1,5,1);
    ScriptApp.newTrigger('yearlyArchive')
      .timeBased()
      .at(targetDate)
      .create();

    // Initialize conditional formatting
    initCondFormatting();
  }
}
