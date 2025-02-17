document.addEventListener("DOMContentLoaded", () => {
    const background = document.getElementById("background");

    // Predefined list of wallpapers (stored inside the extension)
    const predefinedWallpapers = [
        chrome.runtime.getURL("wallpapers/background1.jpg"),
        chrome.runtime.getURL("wallpapers/contact.jpg"),
        chrome.runtime.getURL("wallpapers/background3.jpeg"),
        chrome.runtime.getURL("wallpapers/background4.jpeg"),
        chrome.runtime.getURL("wallpapers/background5.jpeg"),
       // chrome.runtime.getURL("wallpapers/background6.jpeg"),
        chrome.runtime.getURL("wallpapers/background7.jpeg"),
        chrome.runtime.getURL("wallpapers/background8.jpeg"),
        chrome.runtime.getURL("wallpapers/background9.jpeg"),
        chrome.runtime.getURL("wallpapers/background10.jpeg"),
        chrome.runtime.getURL("wallpapers/background11.jpeg"),
        chrome.runtime.getURL("wallpapers/background12.jpeg"),
        chrome.runtime.getURL("wallpapers/background13.jpeg"),
        chrome.runtime.getURL("wallpapers/background14.jpeg"),
        chrome.runtime.getURL("wallpapers/background15.jpeg"),
        chrome.runtime.getURL("wallpapers/background16.jpeg"),
               
    ];

    function setWallpaper(imageUrl) {
        background.style.backgroundImage = `url(${imageUrl})`;
        background.style.backgroundSize = "cover";
        background.style.backgroundPosition = "center";
    }

    function updateWallpaper() {
        chrome.storage.local.get("userWallpaper", (data) => {
            if (data.userWallpaper) {
                // If user selected a custom wallpaper, use it
                setWallpaper(data.userWallpaper);
            } else {
                // Otherwise, pick a random predefined wallpaper
                const randomIndex = Math.floor(Math.random() * predefinedWallpapers.length);
                setWallpaper(predefinedWallpapers[randomIndex]);
            }
        });
    }

    const canvas = document.getElementById("clockCanvas");
    const ctx = canvas.getContext("2d");

    // Set a fixed canvas size for the clock (small enough to fit in the corner)
    canvas.width = 300;  // Adjusted to 200px for clock size
    canvas.height = 100; // Adjusted height to fit clock text

    // Clock Function
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        let ampm = "AM";
    
        // Convert hours to 12-hour format
        if (hours >= 12) {
            ampm = "PM";
            if (hours > 12) {
                hours -= 12; // Convert hour from 24-hour to 12-hour format
            }
        } else if (hours === 0) {
            hours = 12; // Midnight hour (0) becomes 12
        }
    
        // Format the time with 12-hour format
        const time = `${hours}:${minutes}:${seconds} ${ampm}`;
    
        drawClock(time);
    }
    

    // Draw clock on canvas
    function drawClock(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear previous frame
    
        // Draw background with transparent black
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";  // Transparent black
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Entire canvas background
    
        // Disable anti-aliasing for pixelated look
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
    
        // Draw clock text with pixel font
        ctx.fillStyle = "white";
        ctx.font = "40px 'Press Start 2P', monospace";  // Pixel font
        ctx.fillText(time, 40, 60);  // Adjusted position to fit clock size
    }
    

    // Convert Celsius to Fahrenheit
    function celsiusToFahrenheit(celsius) {
        return Math.round((celsius * 9/5) + 32);
    }

    // Weather Function
    function getWeather() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

                    fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            const temperatureC = data.current_weather.temperature;
                            const temperatureF = celsiusToFahrenheit(temperatureC); // Convert to Fahrenheit
                            const weatherCode = data.current_weather.weathercode;

                            const description = getWeatherDescription(weatherCode);
                            const iconSrc = getWeatherIcon(weatherCode);

                            drawWeather(temperatureF, description, iconSrc);
                        })
                        .catch(error => console.error("Weather fetch error:", error));
                },
                (error) => {
                    console.error("Geolocation error:", error);
                }
            );
        } else {
            console.error("Geolocation not supported.");
        }
    }

    function getWeatherDescription(code) {
        const weatherCodes = {
            0: "Clear",
            1: "Mainly Clear",
            2: "Partly Cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Depositing Rime Fog",
            51: "Drizzle",
            53: "Drizzle",
            55: "Drizzle",
            56: "Freezing Drizzle",
            57: "Freezing Drizzle",
            61: "Rain",
            63: "Rain",
            65: "Rain",
            66: "Freezing Rain",
            67: "Freezing Rain",
            71: "Snow",
            73: "Snow",
            75: "Snow",
            77: "Snow Grains",
            80: "Rain Showers",
            81: "Rain Showers",
            82: "Rain Showers",
            85: "Snow Showers",
            86: "Snow Showers",
            95: "Thunderstorm",
            96: "Thunderstorm",
            99: "Thunderstorm"
        };
        return weatherCodes[code] || "Unknown";
    }

    function getWeatherIcon(code) {
        const icons = {
            0: "clear.png",
            1: "cloudy.png",
            2: "cloudy.png",
            3: "cloudy.png",
            45: "cloudy.png", //fog 
            48: "cloudy.png", //fog
            51: "rain.png",
            53: "rain.png",
            55: "rain.png",
            56: "rain.png",
            57: "rain.png",
            61: "rain.png",
            63: "rain.png",
            65: "rain.png",
            66: "rain.png",
            67: "rain.png",
            71: "snow.png",
            73: "snow.png",
            75: "snow.png",
            77: "snow.png",
            80: "rain.png",
            81: "rain.png",
            82: "rain.png",
            85: "snow.png",
            86: "snow.png",
            95: "thunderstorm.png",
            96: "thunderstorm.png",
            99: "thunderstorm.png"
        };
        return `/assets/icons/${icons[code] || "unknown.png"}`;
    }

    function drawWeather(temp, desc, iconSrc) {
        const weatherContainer = document.getElementById("weather-container");
    
        // Ensure the weather section is centered and has a transparent black background
        weatherContainer.innerHTML = `
            <div class="weather-section" style="display: flex; flex-direction: column; align-items: center; background-color: rgba(0, 0, 0, 0.5); padding: 10px; border-radius: 10px; width: 100%; max-width: 300px;">
                <p style="margin: 0; font-size: 20px; color: white;">${temp}°F - ${desc}</p>
                <img src="${iconSrc}" alt="Weather icon" class="weather-icon" style="width: 40px; height: 40px; margin-top: 5px;" />
            </div>
        `;
    }


    //_________________________________________________________________________________________________


    //To do list


    const taskInput = document.getElementById("new-task");
    const addTaskButton = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");

    // Load tasks from localStorage on page load
    loadTasks();

    // Add a new task
    addTaskButton.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const task = { text: taskText, completed: false };
            addTask(task);
            taskInput.value = ""; // Clear input
        }
    });

    // Function to load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            addTaskToDOM(task);
        });
    }

    // Function to add task to the DOM
    function addTask(task) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        addTaskToDOM(task);
    }

    function addTaskToDOM(task) {
        const li = document.createElement("li");
    
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            text.style.textDecoration = checkbox.checked ? "line-through" : "none";
            updateTaskInStorage(task);
        });
    
        const text = document.createElement("span");
        text.textContent = task.text;
        text.style.flexGrow = "1";
    
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "✖";
        deleteButton.addEventListener("click", () => {
            li.style.transform = "scale(0)";
            setTimeout(() => {
                deleteTask(task);
                li.remove();
            }, 300);
        });
    
        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deleteButton);
    
        taskList.appendChild(li);
    }
    

    // Update task in localStorage
    function updateTaskInStorage(updatedTask) {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        const index = tasks.findIndex(task => task.text === updatedTask.text);
        if (index !== -1) {
            tasks[index] = updatedTask;
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    }

    // Delete task from localStorage
    function deleteTask(taskToDelete) {
        let tasks = JSON.parse(localStorage.getItem("tasks"));
        tasks = tasks.filter(task => task.text !== taskToDelete.text);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function removeSponsoredResults() {
        const ads = document.querySelectorAll('[aria-label="Sponsored"]');
        ads.forEach(ad => ad.closest('div')?.remove());
      }
      
      // Run initially to remove ads
      removeSponsoredResults();
      
      // Observe the DOM for dynamic changes (useful for infinite scrolling)
      const observer = new MutationObserver(removeSponsoredResults);
      observer.observe(document.body, { childList: true, subtree: true });















    

    // Update clock every second
    setInterval(updateClock, 1000);
    getWeather(); // Fetch weather on page load

    updateWallpaper(); // Run on page load

    // Listen for updates from the popup
    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === "updateWallpaper") {
            updateWallpaper();
        }
    });
});



/* 
// Function to add task to the DOM (UI)
function addTaskToDOM(task) {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.marginBottom = "10px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.style.marginRight = "10px";
    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        updateTaskInStorage(task);
    });

    const text = document.createElement("span");
    text.style.color = "white";
    text.style.textDecoration = task.completed ? "line-through" : "none";
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.style.marginLeft = "10px";
    deleteButton.style.backgroundColor = "#f44336";
    deleteButton.style.color = "white";
    deleteButton.style.border = "none";
    deleteButton.style.padding = "3px 8px";
    deleteButton.style.borderRadius = "5px";
    deleteButton.addEventListener("click", () => {
        deleteTask(task);
        li.remove();
    });

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(deleteButton);

    taskList.appendChild(li);
}

 */
/* 
    // Create a canvas element and append it to the body
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Set canvas size to fill the screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Load the local sprite sheet
    let img = new Image();
    img.src = chrome.runtime.getURL('pets/smallturtles1.png'); // Path to your local image
    img.onload = function () {
        console.log('Image source:', img.src);
        init();
    };
    img.onerror = function () {
        console.error('Failed to load image');
    };
    

    const scale = 2;
    const width = 16; // Width of each frame in the sprite sheet
    const height = 18; // Height of each frame in the sprite sheet
    const scaledWidth = scale * width;
    const scaledHeight = scale * height;

    // Animation frames and state
    const cycleLoop = [0, 1, 0, 2]; // Frames for walking animation
    let currentLoopIndex = 0;
    let frameCount = 0;
    let currentDirection = 0; // 0 = right, 1 = left
    let x = 0; // X position of the sprite
    let y = canvas.height - scaledHeight; // Y position of the sprite (bottom of the screen)
    let dx = 2; // Horizontal movement speed

    // Draw a single frame of the sprite
    function drawFrame(frameX, frameY, canvasX, canvasY) {
        ctx.drawImage(
            img,
            frameX * width, frameY * height, width, height, // Source rectangle (sprite sheet)
            canvasX, canvasY, scaledWidth, scaledHeight // Destination rectangle (canvas)
        );
        console.log(`Drawing frame at (${canvasX}, ${canvasY})`);

    }

    // Animation loop
    function step() {
        frameCount++;
        if (frameCount < 15) { // Control animation speed
            window.requestAnimationFrame(step);
            return;
        }
        frameCount = 0;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the current frame
        drawFrame(cycleLoop[currentLoopIndex], currentDirection, x, y);

        // Update animation frame
        currentLoopIndex++;
        if (currentLoopIndex >= cycleLoop.length) {
            currentLoopIndex = 0;
        }

        // Move the sprite
        x += dx;

        // Reverse direction if the sprite hits the edge of the screen
        if (x + scaledWidth > canvas.width || x < 0) {
            dx *= -1; // Reverse horizontal direction
            currentDirection = currentDirection === 0 ? 1 : 0; // Change sprite direction
        }

        console.log('Animation step running', x);


        // Continue the animation loop
        window.requestAnimationFrame(step);
    }

    // Initialize the animation
    function init() {
        if (!img.complete) {
            console.log("Image not loaded yet, retrying...");
            setTimeout(init, 100); // Retry initialization after 100ms
            return;
        }
        console.log("Starting animation...");
        window.requestAnimationFrame(step);
    } */