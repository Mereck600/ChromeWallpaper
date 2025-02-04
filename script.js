document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get("wallpaper", (data) => {
      const background = document.getElementById("background");
      if (data.wallpaper) {
        background.style.backgroundImage = `url(${data.wallpaper})`;
      } else {
        background.style.backgroundImage = "url('default-wallpaper.jpg')";
      }
    });
  });
  