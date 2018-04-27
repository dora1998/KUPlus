init();

// 初期化、ページ判定処理
function init() {
  if (location.href.startsWith("https://www.k.kyoto-u.ac.jp/student/la/syllabus/")) {
    $("a").click(function() {
      if ($(this).attr("href").startsWith("detail")) {
        openSyllabus($(this).attr("href"), $(this));
        return false;
      }
    });
    decoTimeTable();
  } else if (location.href == "https://www.k.kyoto-u.ac.jp/student/la/timeslot/timeslot_list") {
    initTimeTable();
  }
}

/* シラバス検索ページ関連 */
function openSyllabus(url, $btn) {
  $row = $btn.parents(".odd_normal, .even_normal");

  fullUrl = getAbsolutePath(url);
  $row.after('<tr class="odd_normal"><td class="table_sdetail" colspan="9">' +
    '<iframe src="' + fullUrl + '" class="s_detail" width="1030" height="400"></iframe>' + 
    '<button width="100" class="s_close">＞＞ 閉じる ＜＜</button>' + 
    '</td></tr>');
  $(".s_close").click(function() {
    closeSyllabus($(this));
  });
}
function closeSyllabus($btn) {
  $btn.parents(".odd_normal, .even_normal").remove();
}
// 時間割チェックボックスの装飾
function decoTimeTable() {
  console.log("decoTimeTable");
  getSavedTimeTable(function(res) {
    console.log(res);
    if (res == undefined) return;

    var $tt = $(".timetable_table").find("tbody");
    for (var j = 0; j < 5; j++) {
      var $tday = $tt.children("tr").eq(1 + j);
      for (var k = 0; k < 5; k++) {
        if (res[j][k] != null) {
          var $tclass = $tday.children("td").eq(1 + k);
          $tclass.attr("style", "position: relative;");
          $tclass.append('<div class="tip_class"></div>');

          var tcolor = res[j][k].name.startsWith("全共") ? "#87ceeb" : "#ff7f50";
          $tclass.css('background-color', tcolor);
          $tclass.children(".tip_class").text(res[j][k].name);
        }
      }
    }
    $(".timetable_sell").hover(function() {
      $(this).children(".tip_class").show();
    }, function() {
      $(this).children(".tip_class").hide();
    });
  })
}

/* 時間割ページ関連 */
function initTimeTable() {
  $("#frame").after('<iframe id="s_frame""></iframe>');
  $("#s_frame").on('load', function() {
    getPlaceData();
  });
  $(".timetable_filled").find("tr").after('<tr class="class_place"></tr>');
  getSavedTimeTable(function(res) {
    if (res == undefined) {
      loadNewTimeTable();
      console.log(getPlaceBox(0, 0).html());
    } else {
      loadSavedTimeTable();
    }
  });
}
function getPlaceBox(day, c) {
  var $tbody = $('div.content > table').eq(1).find("tbody").first();
  if ($tbody == undefined) return undefined;
  var $tday = $tbody.children("tr").eq(4+day);
  if ($tday == undefined) return undefined;
  var $tclass = $tday.children("td").eq(1+c);
  return $tclass;
}

/* キャッシュがない時の処理 */
var loadDay = -1;
var loadClass = -1;
var afterLoad = undefined;
function loadNewTimeTable() {
  afterLoad = function () {
    setTimeout(function () {
      if (loadClass == 4) {
        if (loadDay == 4) {
          afterLoad = undefined;
        } else {
          loadDay++;
          loadClass = 0;
        }
      } else {
        loadClass++;
      }
      loadDataFromSyllabus(loadDay, loadClass);
    }, 1500);
  }
  loadDataFromSyllabus(0, 0);
}
// シラバスにiframe経由でアクセスして情報取得
function loadDataFromSyllabus(day, c) {
  $box = getPlaceBox(day, c);
  //空きコマの場合、スルー
  if (!$box.hasClass("timetable_filled")) {
    if (afterLoad != undefined) afterLoad();
    return;
  }
  //専門科目も取得できないので、名前のみ記録してスルー
  if (!$box.find("tr").first().text().trim().startsWith("全共")) {
    saveTimeTable(day, c, $box.find("tr").first().text().trim(), null);
    if (afterLoad != undefined) afterLoad();
    return;
  }

  loadDay = day;
  loadClass = c;
  loadSyllabus($box.find("a").first().attr("href"));
}
// 指定URL(シラバス)をiframeでロード
function loadSyllabus(url) {
  $("#s_frame").attr("src", url);
}
// iframeで読込完了後、DOMから教室取得
function getPlaceData() {
  $block = getPlaceBox(loadDay, loadClass);
  place = $('#s_frame').contents().find('.standard_list').find("tr").eq(2).children().eq(4).text();
  place = place.trim();
  //console.log(place);
  $block.find(".class_place").text(place);
  saveTimeTable(loadDay, loadClass, $block.find("tr").first().text().trim(), place);
  if (afterLoad != undefined) afterLoad();
}
// localStrageに時間割データを保存
function saveTimeTable(day, c, name, place) {
  chrome.runtime.sendMessage({action: "setTimeTable", day: day, c: c, name: name, place: place},
  function(response) {
  });
}

/* キャッシュから読み込む時の処理 */
function getSavedTimeTable(callback) {
  chrome.runtime.sendMessage({action: "getTimeTable"},
  function(response) {
    callback(response);
  });
}
function loadSavedTimeTable() {
  console.log("Load from LocalStorage");
  getSavedTimeTable(function(res) {
    if (res == undefined) return;
    for (var j = 0; j < 5; j++) {     //月〜金
      for (var k = 0; k < 5; k++) {   //1〜5限
        var cdom = getPlaceBox(j, k);
        if (cdom.hasClass("timetable_filled")) {
          if (res[j][k] != null) {
            if (cdom.find("tr").first().text().trim() == res[j][k].name) {
              if (res[j][k].place != null) cdom.find(".class_place").text(res[j][k].place);
            } else {
              console.log("TimeTable ReLoad");
              loadDataFromSyllabus(j, k);
            }
          } else {
            console.log("TimeTable ReLoad");
            loadDataFromSyllabus(j, k);
          }
        }
      }
    }
  });
}

function getAbsolutePath(path) {
  var baseUrl = location.href;
  var url = new URL(path, baseUrl);
  return url.href;
}