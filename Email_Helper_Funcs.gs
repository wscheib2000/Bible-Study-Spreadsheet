function postEmail(email, gender, frequency) {
  // Process the user's response.
  var emailSheet = SpreadsheetApp.getActive().getSheetByName("Email Notifications");
  var emails = getEmails();

  if (emails.includes(email)) {
    var ui = SpreadsheetApp.getUi();
    var result = ui.alert('That email is already on the list. Override preference/frequency?',
                          ui.ButtonSet.YES_NO);
    
    if (result === ui.Button.YES) {
      var index = emails.indexOf(email);
      emailSheet.getRange(index+2,3,1,3).setValues([[gender, frequency]]);
    }
  } else {
    var today = new Date();
    
    emailSheet.insertRows(2,1);
    emailSheet.getRange(2,1,1,4).setValues([[today, email, gender, frequency]]);
  }
}

function getEmails() {
  var emailSheet = SpreadsheetApp.getActive().getSheetByName('Email Notifications');
  var lastRow = emailSheet.getLastRow();
  var emails = [];
  if (lastRow == 1) return emails;

  var emailArrays = emailSheet.getRange(2,2,lastRow-1,1).getValues();
  for(var i=0; i<emailArrays.length; i++) {
    emails.push(emailArrays[i][0]);
  }
  return emails;
}

function deleteEmail(email) {
  var emailSheet = SpreadsheetApp.getActive().getSheetByName('Email Notifications');
  var lastRow = emailSheet.getLastRow();
  var ui = SpreadsheetApp.getUi();
  
  result = ui.alert('Are you sure you want to remove ' + email + ' as a notification email?',
                     ui.ButtonSet.YES_NO);
  if (result === ui.Button.YES) {
    var emailArrays = emailSheet.getRange(2,2,lastRow-1,1).getValues();
    var index = emailArrays.findIndex(element => element[0] == email);
    if (index != -1) emailSheet.deleteRow(index + 2);
  }
}
