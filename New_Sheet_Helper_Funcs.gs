function setupPostForm(campus, greek, grad) {
  Logger.log(typeof(greek) + " greek: " + greek + "\n" + typeof(grad) + " grad: " + grad);
  var year = new Date().getFullYear();
  var sheet = SpreadsheetApp.getActiveSpreadsheet();

  // Rename spreadsheet and create yearly sheets
  sheet.rename(campus + " Bible Study Spreadsheet");

  var name = '';
  var template = initTemplateSheet(sheet);
  if (grad) {
    for (var i = 9; i >= 0; i--) {
      if (i%5 > 0) name = year+(i%5) + ((i > 4) ? ' Women' : ' Men');
      else name = 'Grad' + ((i > 4) ? ' Women' : ' Men');
      
      sheet.insertSheet(name, sheet.getNumSheets(), {template: template})
    } 
  } else {
    for (var i = 7; i >= 0; i--) {
      Logger.log("1");

      name = year+(i%4+1) + ((i > 4) ? ' Women' : ' Men');
      
      sheet.insertSheet(name, sheet.getNumSheets(), {template: template})
    }
  }
  sheet.deleteSheet(template);

  // Create Email Notifications sheet
  var colNames = [['DATE ADDED', 'EMAIL', 'GENDER', 'FREQUENCY']];
  var colWidths = [100, 200, 100, 100];
  
  var newSheet = sheet.insertSheet('Email Notifications');

  newSheet
    .getRange(1,1,1,4)
    .setValues(colNames)
    .setFontWeight('bold');
  newSheet.setFrozenRows(1);
  
  for (var j = 0; j < colWidths.length; j++) {
    newSheet.setColumnWidth(j+1, colWidths[j]);
  }

  sheet.getSheetByName('Email Notifications').hideSheet().protect();

  colNames = [['FORM SUBMISSION TIME', 'FIRST NAME', 'LAST NAME', 'GENDER',
                   'EMAIL', 'PHONE NUMBER', 'GRAD YEAR', 'OTHER', 'NOTES']];
  colWidths = [180, 115, 115, 80, 200, 125, 100, 150, 200];
  
  newSheet = sheet.insertSheet('Former Students');

  newSheet
    .getRange(1,1,1,9)
    .setValues(colNames)
    .setFontWeight('bold');
  newSheet.setFrozenRows(1);
  
  for (var j = 0; j < colWidths.length; j++) {
    newSheet.setColumnWidth(j+1, colWidths[j]);
  }

  sheet.getSheetByName('Former Students').hideSheet().protect();

  colWidths = [100, 150, 150, 100, 125];
  colNames = [['DATE ADDED', 'NAME', 'COLEADER', 'GENDER',
                   'COLOR']];

  newSheet = sheet.insertSheet('Leaders');

  newSheet
    .getRange(1,1,1,5)
    .setValues(colNames)
    .setFontWeight('bold');
  newSheet.setFrozenRows(1);
  
  for (var j = 0; j < colWidths.length; j++) {
    newSheet.setColumnWidth(j+1, colWidths[j]);
  }

  sheet.getSheetByName('Leaders').hideSheet().protect();


  // Create form
  createForm(campus, greek, grad, year);
}

function createForm(campus, greek, grad, year) {
  // Create form
  var form = FormApp.create(campus + ' Bible Study Signup Form');
  form.setDescription('Want to grow in your faith while also making life long friends?' +
                      'Then check out a Bible Study! Student led groups meet once a week' +
                      'to talk about life, faith, and what it means to be a disciple of' +
                      'Christ while in college.');
  form.addTextItem()
    .setTitle('First name');
  form.addTextItem()
    .setTitle('Last name');
  form.addListItem()
    .setTitle('Gender')
    .setChoiceValues(['Male','Female']);
  form.addTextItem()
    .setTitle('Email');
    form.addTextItem()
    .setTitle('Phone number (10 digit US)');
  
  if (grad) {
    form.addMultipleChoiceItem()
      .setTitle("Graduation year")
      .setChoiceValues([year+4, year+3, year+2, year+1, "Graduate Student/Other"]);
  } else {
    Logger.log("2");

    form.addMultipleChoiceItem()
      .setTitle("Graduation year")
      .setChoiceValues([year+4, year+3, year+2, year+1]);
  }

  if (greek) {
    form.addCheckboxItem()
    .setTitle("Other")
    .setChoiceValues(['Spanish speaking bible study', 'Varsity or Club athlete', 'Greek Life - Fraternity', 'Greek Life - Sorority']);
  } else {
    Logger.log("3");

    form.addCheckboxItem()
    .setTitle("Other")
    .setChoiceValues(['Spanish speaking bible study', 'Varsity or Club athlete']);
  }


  // Link to Form Responses sheet
  form.setDestination(FormApp.DestinationType.SPREADSHEET, SpreadsheetApp.getActiveSpreadsheet().getId());
  SpreadsheetApp.flush();
  SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].setName('Form Responses').hideSheet();

  // Send email with edit URL
  MailApp.sendEmail(Session.getActiveUser().getEmail(), 'Bible Study Google Form Edit Link', form.getEditUrl());
  SpreadsheetApp.getUi().alert('You will get an email (to the account you signed in with earlier)' +
                               'with the edit link to your bible study signup form.')
}

function initTemplateSheet(sheet) {
  var colNames = [['FORM SUBMISSION TIME', 'FIRST NAME', 'LAST NAME', 'GENDER',
                   'EMAIL', 'PHONE NUMBER', 'GRAD YEAR', 'OTHER', 'NOTES',
                   'BIBLE STUDY LEADER', 'POINT OF CONTACT']];
  var colWidths = [180, 115, 115, 80, 200, 125, 100, 150, 200, 160, 145]
  
  var newSheet = sheet.insertSheet('Template Sheet');

  newSheet
    .getRange(1,1,1,11)
    .setValues(colNames)
    .setFontWeight('bold');
  
  newSheet.setFrozenRows(1);
  
  for (var j = 0; j < colWidths.length; j++) {
    newSheet.setColumnWidth(j+1, colWidths[j]);
  }
  return newSheet;
}

function initCondFormatting() {
  // For loop through sheets to set rules
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  var numLeaders = getLeaders().length;
  if (numLeaders === 0) return;
  var leaders = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leaders')
                              .getRange(2,1,numLeaders,5).getValues();

  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().includes('Men') || sheets[i].getName().includes('Women')) {
      // Create rules list with standard formatting rules
      var rules = [SpreadsheetApp.newConditionalFormatRule()
                                .whenFormulaSatisfied('=AND($J2="", NE($K2, ""),NE($B2, ""))')
                                .setBackground('#00ffff')
                                .setRanges([sheets[i].getRange(2,1,999,11)])
                                .build(),
                    SpreadsheetApp.newConditionalFormatRule()
                                .whenFormulaSatisfied('=AND($J2="", $K2="", NE($B2, ""))')
                                .setBackground('#ffff00')
                                .setRanges([sheets[i].getRange(2,1,999,11)])
                                .build()];

      // Set rules
      sheets[i].setConditionalFormatRules(rules);
    }
  }
}
