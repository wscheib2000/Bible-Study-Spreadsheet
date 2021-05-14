function postLeader(name, coleader, gender, color) {
  var leaderSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leaders');
  var leaders = getLeaders();
  var ui = SpreadsheetApp.getUi();

  if (leaders.includes(name)) {
    result = ui.alert('That leader is already on the list. Override coleader/gender/color?',
                      ui.ButtonSet.YES_NO);

    if (result === ui.Button.YES) {
      var index = leaders.indexOf(name);
      leaderSheet.getRange(index+2,3,1,3).setValues([[coleader, gender, color]]);
    }
  } else {
    var today = new Date();
    
    leaderSheet.getRange(2+leaders.length,1,1,5).setValues([[today,name,coleader,gender,color]]);
  }

  // updateCondFormatting();
}

function getLeaders(gender = 'MaleFemale') {
  var leaderSheet = SpreadsheetApp.getActive().getSheetByName('Leaders');
  var lastRow = leaderSheet.getLastRow();
  var leaders = [];
  if (lastRow == 1) return leaders;

  var leaderArrays = leaderSheet.getRange(2,2,lastRow-1,3).getValues();
  for(var i=0; i<leaderArrays.length; i++) {
    if (gender.includes(leaderArrays[i][2])) leaders.push(leaderArrays[i][0]);
  }
  return leaders;
}

function getLeadersAndColeaders(gender = 'MaleFemale') {
  var leaderSheet = SpreadsheetApp.getActive().getSheetByName('Leaders');
  var lastRow = leaderSheet.getLastRow();
  var leaders = [];
  if (lastRow == 1) return leaders;

  var leaderArrays = leaderSheet.getRange(2,2,lastRow-1,3).getValues();
  for(var i=0; i<leaderArrays.length; i++) {
    if (gender.includes(leaderArrays[i][2])) leaders.push([leaderArrays[i][0], leaderArrays[i][1]]);
  }
  return leaders;
}

function getLeadersAndColeadersFormatted(gender = 'MaleFemale') {
  var leaderSheet = SpreadsheetApp.getActive().getSheetByName('Leaders');
  var lastRow = leaderSheet.getLastRow();
  var leaders = [];
  if (lastRow == 1) return leaders;

  var leaderArrays = leaderSheet.getRange(2,2,lastRow-1,3).getValues();
  for(var i=0; i<leaderArrays.length; i++) {
    if (gender.includes(leaderArrays[i][2])) {
      if (leaderArrays[i][1] === '') leaders.push(leaderArrays[i][0]);
      else leaders.push(leaderArrays[i][0] + ' and ' + leaderArrays[i][1]);
    }
  }
  return leaders;
}

function deleteLeader(name) {
  var leaderSheet = SpreadsheetApp.getActive().getSheetByName('Leaders');
  var lastRow = leaderSheet.getLastRow();
  var ui = SpreadsheetApp.getUi();

  if (name.includes(' and ')) {
    var alertText = 'Are you sure you want to remove ' + name + ' as Bible Study leaders?';
    var mainName = name.substr(0,name.indexOf(' and '));
  } else {
    var alertText = 'Are you sure you want to remove ' + name + ' as a Bible Study leader?';
    var mainName = name;
  }

  result = ui.alert(alertText,
                     ui.ButtonSet.YES_NO);
  if (result === ui.Button.YES) {
    var leaderArrays = leaderSheet.getRange(2,2,lastRow-1,1).getValues();
    var index = leaderArrays.findIndex(element => element[0] == mainName);
    if (index != -1) leaderSheet.deleteRow(index + 2);
  }
}
