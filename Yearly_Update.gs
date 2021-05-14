function yearlyFreshmanUpdate() {
  // Update spreadsheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var year = new Date().getFullYear();

  // Create new freshmen sheets
  SpreadsheetApp.flush();
  initNewSheet(sheet, (year+4)+ ' Men');
  sheet.setActiveSheet(sheet.getSheetByName((year+4)+ ' Men'));
  sheet.moveActiveSheet(sheet.getSheetByName((year+3)+ ' Men').getIndex());
  initNewSheet(sheet, (year+4)+ ' Women');
  sheet.setActiveSheet(sheet.getSheetByName((year+4)+ ' Women'));
  sheet.moveActiveSheet(sheet.getSheetByName((year+3)+ ' Women').getIndex());


  // Update form
  var form = FormApp.openByUrl(sheet.getFormUrl());
  var gradYear = form.getItems()[5].asMultipleChoiceItem();
  var choices = gradYear.getChoices();
  choices.unshift(gradYear.createChoice(year+4));
  gradYear.setChoices(choices);

  // Create new trigger
  var targetDate = new Date();
  targetDate.setHours(8,0,0,0);
  targetDate.setFullYear(year+1,3,1);
  ScriptApp.newTrigger('yearlyFreshmanUpdate')
    .timeBased()
    .at(targetDate)
    .create();
}

function yearlyArchive() {
  // Update spreadsheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var year = new Date().getFullYear();

  // Transfer senior data to Former Students and delete sheets
  var seniorMen = sheet.getSheetByName(year + ' Men');
  var seniorWomen = sheet.getSheetByName(year + ' Women');
  var formerStudents = sheet.getSheetByName('Former Students');

  if (seniorMen.getLastRow > 1) {
    seniorMenData = seniorMen.getRange(2,1,seniorMen.getLastRow()-1,9).getValues();
    formerStudents.getRange(formerStudents.getLastRow()+1,1,seniorMenData.length,9).setValues(seniorMenData);
  }
  sheet.deleteSheet(seniorMen);

  if (seniorWomen.getLastRow > 1) {
    seniorWomenData = seniorWomen.getRange(2,1,seniorWomen.getLastRow()-1,9).getValues();
    formerStudents.getRange(formerStudents.getLastRow()+1,1,seniorWomenData.length,9).setValues(seniorWomenData);
  }
  sheet.deleteSheet(seniorWomen);


  // Update form
  var form = FormApp.openByUrl(sheet.getFormUrl());
  var gradYear = form.getItems()[5].asMultipleChoiceItem();
  var choices = gradYear.getChoices();
  choices.splice(4,1);
  gradYear.setChoices(choices);


  // Create new trigger
  var targetDate = new Date();
  targetDate.setHours(8,0,0,0);
  targetDate.setFullYear(year+1,5,1);
  ScriptApp.newTrigger('yearlyArchive')
    .timeBased()
    .at(targetDate)
    .create();
}
