document.getElementById("save").addEventListener("click", () => {
    const url = document.getElementById("wallpaperUrl").value;
    chrome.storage.sync.set({ wallpaper: url }, () => {
      alert("Wallpaper updated! Open a new tab to see the change.");
    });
  });
  