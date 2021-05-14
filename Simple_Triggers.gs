/** @OnlyCurrentDoc */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var sheet = SpreadsheetApp.getActiveSpreadsheet();

  // Create Controls menu
  ui.createMenu("Controls")
    .addItem("Add leader", "addLeader")
    .addItem("Remove leader", "removeLeader")
    .addSeparator()
    .addItem("Add notification email", "addEmail")
    .addItem("Remove notification email", "removeEmail")
    .addSeparator()
    .addItem("Run new sheet setup", "setup")

    .addToUi();
  
  // Hide sheets that should be hidden
  sheet.getSheetByName('Form Responses').hideSheet();
  sheet.getSheetByName('Email Notifications').hideSheet();
  sheet.getSheetByName('Leaders').hideSheet();
  sheet.getSheetByName('Former Students').hideSheet();
}

function onEdit(e) {
  var sheet = SpreadsheetApp.getActiveSheet();
  
  if (sheet.getName().includes('Men') || sheet.getName().includes('Women')) {
    var leadersAndCos = getLeadersAndColeaders((sheet.getName().includes('Men')) ? 'Male' : 'Female');
    var leadersFormatted = getLeadersAndColeadersFormatted();
    var leaders = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leaders')
                                .getRange(2,1,leadersFormatted.length,5).getValues();
    
    // Generate dropdown lists
    var dropDownList = [];
    
    if (leadersAndCos.length > 0) {
      for (var i = 0; i < leadersAndCos.length; i++) {
        if (leadersAndCos[i][1] === '') dropDownList.push(leadersAndCos[i][0]);
        else dropDownList.push(leadersAndCos[i][0] + ' and ' + leadersAndCos[i][1]);
      }
    }

    for (var i = (e.range.getRow() === 1) ? 1 : 0; i < e.range.getLastRow()-e.range.getRow()+1; i++) {
      // Change dropdowns in leader column
      if (sheet.getRange(e.range.getRow()+i, 1).getValue() === '' && 
          sheet.getRange(e.range.getRow()+i, 4).getValue() === '') {
        sheet.getRange(e.range.getRow()+i, 10).clearDataValidations();
      } else {
        var validationRule = SpreadsheetApp.newDataValidation().requireValueInList(dropDownList).build();
        sheet.getRange(e.range.getRow()+i, 10).setDataValidation(validationRule);
      }

      // Format if necessary
      if (e.range.getColumn() <= 10 <= e.range.getLastColumn()) {
        Logger.log(e.range.getValues());
        var leader = e.range.getValues()[i][e.range.getLastColumn()-e.range.getColumn()];
        if (e.range.getValues()[i][e.range.getLastColumn()-e.range.getColumn()] === '') {
          sheet.getRange(e.range.getRow(),1,1,11).setBackground(null);
        } else if (leadersFormatted.includes(leader)) {
          sheet.getRange(e.range.getRow(),1,1,11).setBackground(leaders[leadersFormatted.indexOf(leader)][4]);
        }
      }
    }
  }
}
