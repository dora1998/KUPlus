function onRequest( request, sender, callback ) {
  if (request.action == 'getTimeTable') {
    console.log("getTimeTable");
    callback(getTimeTable());
  } else if (request.action == 'setTimeTable') {
    var data = getTimeTable();
    if (data == undefined) {
      data = new Array(5);
      for(var j = 0; j < 5; j++) {
        data[j] = new Array(5);
      }
    }
    data[request.day][request.c] = {"name": request.name, "place": request.place};
    localStorage['timetable'] = JSON.stringify(data);
    console.log("Saved Day:" + request.day + " Class:" + request.c + " Name:" + request.name + " Place:" + request.place);
  }
}
function getTimeTable() {
    var data = localStorage['timetable'];
    if (data != undefined) data = JSON.parse(data);
    return data;
}
chrome.runtime.onMessage.addListener(onRequest);