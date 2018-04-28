init();

// 初期化、ページ判定処理
function init() {
  var P_SURL = /https:\/\/www.k.kyoto-u.ac.jp\/student\/.+\/syllabus.*/;
  var P_NOTICE = /https:\/\/www.k.kyoto-u.ac.jp\/student\/.+\/notice.*/;
  var P_DEPTOP = /https:\/\/www.k.kyoto-u.ac.jp\/student\/.+\/department_home\/top/;
  if (location.href.match(P_SURL) != null) {
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

  if (location.href.match(P_NOTICE) != null || location.href.match(P_DEPTOP) != null) {
    addMyDepButton();
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
  // シラバス裏取得用iframe生成
  $("#frame").after('<iframe id="s_frame""></iframe>');
  $("#s_frame").on('load', function() {
    getPlaceData();
  });
  // 教室場所表示用tr生成
  $(".timetable_filled").find("tr").after('<tr class="class_place"></tr>');
  // クイックアクション用div生成
  $(".timetable_filled").css("position", "relative");
  $(".timetable_filled").append('<div class="tip_timetable">' + 
    '<ul><li><a href="" class="tip_a_ref"><img src="/img/button_mini_general_01.gif">授業資料</a></li>' +
    '<ul><li><a href="" class="tip_a_report"><img src="/img/button_mini_general_01.gif">レポート</a></li>' +
    '<ul><li><a href="" class="tip_a_info"><img src="/img/button_mini_general_01.gif">授業連絡</a></li>' +
    '</ul></div>');
  $(".timetable_filled").hover(function() {
    $(this).children(".tip_timetable").show();
  }, function() {
    $(this).children(".tip_timetable").hide();
  });

  setQuickActionLink();
  getSavedTimeTable(function(res) {
    if (res == undefined) {
      loadNewTimeTable();
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
            // 科目名が保存データと一致するときのみ読込
            if (cdom.find("tr").first().text().trim() == res[j][k].name) {
              if (res[j][k].place != null) cdom.find(".class_place").text(res[j][k].place);
            } else {
              loadDataFromSyllabus(j, k);
            }
          } else {
            // 新しくコマが入ってたときはシラバスから読込
            loadDataFromSyllabus(j, k);
          }
        }
      }
    }
  });
}

// クイックアクションリンクの設定
function setQuickActionLink() {
  var SURL_PATTERN = /(\/student\/.+\/support\/)top\?no=(\d+).*/;
  for (var j = 0; j < 5; j++) {     //月〜金
    for (var k = 0; k < 5; k++) {   //1〜5限
      var cdom = getPlaceBox(j, k);
      if (cdom.hasClass("timetable_filled")) {
        var surl = cdom.find("a").first().attr("href");
        var urlMatch = surl.match(SURL_PATTERN);
        if (urlMatch != null) {
          var sBaseUrl = urlMatch[1];
          var sNo = urlMatch[2];
          cdom.find(".tip_a_ref").attr("href", sBaseUrl + "lecture_material_list?no=" + sNo);
          cdom.find(".tip_a_report").attr("href", sBaseUrl + "report_list?no=" + sNo);
          cdom.find(".tip_a_info").attr("href", sBaseUrl + "course_mail_list?no=" + sNo);
        }
      }
    }
  }
}

function addMyDepButton() {
  console.log("Add MyDepButton");
  $(".menu").append('<a href="" class="my_department">My部局</a>');
  $(".menu").append('<a href="" class="my_department_reg">My部局を登録</a>');
}

// URLの相対パス→絶対パス変換
function getAbsolutePath(path) {
  var baseUrl = location.href;
  var url = new URL(path, baseUrl);
  return url.href;
}