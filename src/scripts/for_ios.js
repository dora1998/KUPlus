function getKPlaceBox_nojq(day, c) {
  let tbody = document.querySelector("div.content > table.entry_table").querySelector("tbody");
  if (tbody == null) return null;
  let tday = tbody.querySelectorAll("tr")[4+day];
  if (tday == undefined) return null;
  let tclass = tday.querySelectorAll("td")[1+c];
  return tclass;
}
function getKCSVData() {
  var DAYARR = ['月', '火', '水', '木', '金'];
  var csvArr = new Array(1+4*5);
  csvArr[0] = ['', '1', '2', '3', '4', '5'];
  for (var j = 0; j < 5; j++) {
    for (var k = 0; k < 4; k++) {
      csvArr[1 + j * 4 + k] = new Array(6);
      csvArr[1 + j * 4 + k].fill('');
    }
    csvArr[1 + j * 4][0] = DAYARR[j];
  }

  for (var j = 0; j < 5; j++) {     //月〜金
    for (var k = 0; k < 5; k++) {   //1〜5限
      var cdom = getKPlaceBox_nojq(j, k);
      if (!(cdom.classList.contains("entry_interest") || cdom.classList.contains("entry_other"))) continue;

      csvArr[1 + j * 4][k + 1] = cdom.querySelector("a").textContent.trim();
      var textArr = cdom.innerText.split("\n");
      csvArr[1 + j * 4 + 1][k + 1] = textArr[2].trim().replace("&nbsp;", "");   // 講師名
      csvArr[1 + j * 4 + 2][k + 1] = textArr[3].trim().replace("&nbsp;", "");   // 科目群
      csvArr[1 + j * 4 + 3][k + 1] = textArr[4].trim().replace("&nbsp;", "");   // 教室場所
    }
  }

  return csvArr;
}
function downloadICS() {
  var timedata = {
    0: ["084500", "101500"],
    1: ["103000", "120000"],
    2: ["130000", "143000"],
    3: ["144500", "161500"],
    4: ["163000", "180000"]
  };

  var timetable_data = getKCSVData();
  var icsOutput = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//github.com//dora1998
X-WR-CALNAME:京大時間割
CALSCALE:GREGORIAN
BEGIN:VTIMEZONE
TZID:Asia/Tokyo
TZURL:http://tzurl.org/zoneinfo-outlook/Asia/Tokyo
X-LIC-LOCATION:Asia/Tokyo
BEGIN:STANDARD
TZOFFSETFROM:+0900
TZOFFSETTO:+0900
TZNAME:JST
DTSTART:19700101T000000
END:STANDARD
END:VTIMEZONE
`;

for (var j = 0; j < 5; j++) {     //月〜金
  for (var k = 0; k < 5; k++) {   //1〜5限
    let class_title = timetable_data[1 + j * 4][k + 1];
    let class_place = timetable_data[1 + j * 4 + 3][k + 1];
    if (class_title === "") continue;

    icsOutput += `BEGIN:VEVENT
DTSTART;TZID="Asia/Tokyo":2018100${1 + j}T${timedata[k][0]}
DTEND;TZID="Asia/Tokyo":2018100${1 + j}T${timedata[k][1]}
SUMMARY:${class_title}
UID:kyodai_timetable_${j}_${k}
LOCATION:${class_place}
SEQUENCE:0
STATUS:CONFIRMED
TRANSP:OPAQUE
END:VEVENT
`;
    }
  }
  icsOutput += `END:VCALENDAR`;
  
  console.log(icsOutput);
  return icsOutput;
}

var icsData = downloadICS();
var res = {"value": icsData};
completion(res);