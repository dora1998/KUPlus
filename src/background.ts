import MessageSender = chrome.runtime.MessageSender;

const LOCALSTORAGE_TIMETABLE = "timetable";

function onRequest(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: any,
  sender: MessageSender,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (response?: any) => void
): void {
  if (request.action == "getTimeTable") {
    console.log("getTimeTable");
    callback(getTimeTable());
  } else if (request.action == "setTimeTable") {
    let data = getTimeTable();
    if (data == undefined) {
      data = new Array(5);
      for (let j = 0; j < 5; j++) {
        data[j] = new Array(5);
      }
    }
    data[request.day][request.c] = { name: request.name, place: request.place };
    localStorage[LOCALSTORAGE_TIMETABLE] = JSON.stringify(data);
    console.log(
      "Saved Day:" +
        request.day +
        " Class:" +
        request.c +
        " Name:" +
        request.name +
        " Place:" +
        request.place
    );
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTimeTable(): any {
  let data = localStorage[LOCALSTORAGE_TIMETABLE];
  if (data != undefined) data = JSON.parse(data);
  return data;
}
chrome.runtime.onMessage.addListener(onRequest);
