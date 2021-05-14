/** @OnlyCurrentDoc */
function sendEmails(timeIncrement, startTime) {
  var emailSheet = SpreadsheetApp.getActive().getSheetByName("Email Notifications")
  var formSheet = SpreadsheetApp.getActive().getSheetByName("Form Responses")
  
  var mostRecent = formSheet.getRange(2,1,50,8).getValues()
  var menMessageHTML = '<b>Men\'s ' + timeIncrement + ' Digest</b><br>--------------------------------'
  var womenMessageHTML = '<b>Women\'s ' + timeIncrement + ' Digest</b><br>--------------------------------'
  var menMessageHTMLLen = menMessageHTML.length;
  var womenMessageHTMLLen = womenMessageHTML.length;
  var person = [];
  var newMen = false;
  var newWomen = false;

  for (var i=0; i<50; i++) {
    person = mostRecent[i];
    if (person[0] >= startTime) {      
      if(person[3] == "Male") {
        if (!newMen) newMen = !newMen;
        var menMessageHTML = menMessageHTML + 
                    '<br><br>Name: ' + person[1] + ' ' + person[2] + 
                    '<br>Gender: ' + person[3] + 
                    '<br>Graduation Year: ' + person[6] + 
                    '<br>Phone number: ' + person[5] + 
                    '<br>Email: ' + person[4] + 
                    '<br>Other Info: ' + person[7];
      } else if(person[3] == "Female") {
        if (!newWomen) newWomen = !newWomen;
        var womenMessageHTML = womenMessageHTML + 
                    '<br><br>Name: ' + person[1] + ' ' + person[2] + 
                    '<br>Gender: ' + person[3] + 
                    '<br>Graduation Year: ' + person[6] + 
                    '<br>Phone number: ' + person[5] + 
                    '<br>Email: ' + person[4] + 
                    '<br>Other Info: ' + person[7];
      }
    }
  }
  
  var lastRow = emailSheet.getLastRow();
  
  if (lastRow > 1) {
    var emails = emailSheet.getRange(2, 1, lastRow-1, 4).getValues();

    for (var i in emails) {
      if (emails[i][3] == timeIncrement && 
         ((emails[i][2].includes("Male") && newMen) || (emails[i][2].includes("Female") && newWomen))) {
        var emailAddress = emails[i][1];
        var messageHTML = '';

        if (emails[i][2] == ("Male")) {
          var subject = 'Bible Study Signup Men\'s ' + timeIncrement + ' Digest';
          messageHTML = messageHTML + menMessageHTML;
        } else if (emails[i][2] == ("Female")) {
          var subject = 'Bible Study Signup Women\'s ' + timeIncrement + ' Digest';
          messageHTML = messageHTML + womenMessageHTML;
        } else {
          var subject = 'Bible Study Signup ' + timeIncrement + ' Digest';
          if (menMessageHTML.length > menMessageHTMLLen) {
            messageHTML = messageHTML + menMessageHTML;
            if (womenMessageHTML.length > womenMessageHTMLLen) messageHTML = messageHTML + '<br><br><br>' + womenMessageHTML;
          } else {
            messageHTML = messageHTML + womenMessageHTML;
          }
        }

        var messagePlain = messageHTML.replace(/(<([^>]+)>)/ig, ""); // clear html tags for plain mail
        MailApp.sendEmail(emailAddress, subject, messagePlain, { htmlBody: messageHTML });
      }
    }
  }
}

function sendDailyEmails() {
  var timeIncrement = 'Daily';
  var startTime = new Date();
  if (startTime.getDate() === 1) {
    if (startTime.getMonth() === 0) startTime.setFullYear(startTime.getFullYear()-1)
    startTime.setMonth((startTime.getMonth()+12-1)%12);
    if (startTime.getMonth() === 1) startTime.setDate(28);
    else if ([3, 5, 8, 10].includes(startTime.getMonth())) startTime.setDate(30);
    else startTime.setDate(31);
  } else {
    startTime.setDate(startTime.getDate() - 1)
  }
  startTime.setHours(8,0,0,0);

  sendEmails(timeIncrement, startTime)
}

function sendWeeklyEmails() {
  var timeIncrement = 'Weekly';
  var startTime = new Date();
  if (startTime.getDate() < 7) {
    if (startTime.getMonth() === 0) startTime.setFullYear(startTime.getFullYear()-1)
    startTime.setMonth((startTime.getMonth()+12-1)%12);
    if (startTime.getMonth() === 1) startTime.setDate((28+startTime.getDate()-7)%28);
    else if ([3, 5, 8, 10].includes(startTime.getMonth())) startTime.setDate((30+startTime.getDate()-7)%30);
    else startTime.setDate((31+startTime.getDate()-7)%31);
  } else {
    startTime.setDate(startTime.getDate() - 7)
  }
  startTime.setHours(8,0,0,0);
  
  sendEmails(timeIncrement, startTime)
}
