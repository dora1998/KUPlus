window.onload = () => {
  document.querySelectorAll(".container button").forEach((b) => {
    b.addEventListener('click', (e) => {
      const url = b.getAttribute("href") || 'http://www.kyoto-u.ac.jp';
      chrome.tabs.create({url});
      return false;
    });
  });
};