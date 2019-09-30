import $ from 'jquery';

$(function() {
    $(".container button").click(function() {
        chrome.tabs.create({"url": $(this).attr("href")});
        return false;
    });
});