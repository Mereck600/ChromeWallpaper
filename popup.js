document.addEventListener("DOMContentLoaded", () => {
    const randomBtn = document.getElementById("randomWallpaper");
    const customInput = document.getElementById("customUrl");
    const saveCustomBtn = document.getElementById("saveCustom");

    // User chooses a random wallpaper
    randomBtn.addEventListener("click", () => {
        chrome.storage.local.remove("userWallpaper", () => {
            chrome.runtime.sendMessage({ action: "updateWallpaper" });
            alert("Random wallpapers enabled!");
        });
    });

    // User saves a custom wallpaper URL
    saveCustomBtn.addEventListener("click", () => {
        const customUrl = customInput.value.trim();
        if (customUrl) {
            chrome.storage.local.set({ userWallpaper: customUrl }, () => {
                chrome.runtime.sendMessage({ action: "updateWallpaper" });
                alert("Custom wallpaper saved!");
            });
        }
    });

    // Load the saved custom wallpaper URL (if any)
    chrome.storage.local.get("userWallpaper", (data) => {
        if (data.userWallpaper) {
            customInput.value = data.userWallpaper;
        }
    });
});
