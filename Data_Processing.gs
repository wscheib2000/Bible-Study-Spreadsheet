/** @OnlyCurrentDoc */
function processData() {
  sortResponses()

  var inputSheet = SpreadsheetApp.getActive().getSheetByName("Form Responses");

  var newRow = inputSheet.getRange(2,1,1,8).getValues()[0];
  newRow[5] = formatPhoneNum(newRow[5])
  inputSheet.getRange(2,1,1,8).setValues([newRow]);

  var outputSheetName = newRow[6] + " " + ((newRow[3] == "Male") ? "Men" : "Women");
  var outputSheet = SpreadsheetApp.getActive().getSheetByName(outputSheetName);

  outputSheet.insertRows(2,1);//shift all rows down by one from row 2
  outputSheet.getRange(2,1,1,8).setValues([newRow]);
}

function sortResponses() {
  var sheet = SpreadsheetApp.getActive().getSheetByName("Form Responses");
  sheet.sort(1, false);
}

function formatPhoneNum(num) {
  num = num.toString().replace(/\D/g,'');
  return '(' + num.substring(0,3) + ') ' + num.substring(3,6) + '-' + num.substring(6);
}
