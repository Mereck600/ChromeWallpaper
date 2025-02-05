chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed!");
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.userWallpaper) {
        // Send a message to all open tabs to update their wallpaper
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
                chrome.tabs.sendMessage(tab.id, { action: "updateWallpaper" });
            });
        });
    }
});
