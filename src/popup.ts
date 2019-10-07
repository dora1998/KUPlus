window.onload = (): void => {
  document.querySelectorAll(".container button").forEach(b => {
    b.addEventListener("click", () => {
      const url = b.getAttribute("href") || "http://www.kyoto-u.ac.jp";

      // 新規タブページにいたら、新しくタブを開かない
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs.length > 0 && tabs[0].url === "chrome://newtab/") {
          chrome.tabs.update({ url });
          window.close();
        } else {
          chrome.tabs.create({ url });
        }
      });
      return false;
    });
  });
};
