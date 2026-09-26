
// ==================================================
// LOCAL STORAGE
// ==================================================

function saveData() {

    let name = document
        .getElementById("storageUsername")
        .value
        .trim();


    // Check if name is empty

    if (name === "") {

        document.getElementById("storageDisplay").innerText =
            "Please enter your name.";

        return;
    }


    // Save name to Local Storage

    localStorage.setItem("userName", name);


    // Show welcome message

    let welcome =
        document.getElementById("welcomeMessage");

    welcome.innerText =
        "WELCOME, " + name.toUpperCase();

    welcome.style.display = "block";


    // Hide Local Storage

    document.getElementById("localStorageSection").style.display =
        "none";


    // Show API features

    document.getElementById("otherFeatures").style.display =
        "flex";


    // Initialize Map

    initializeMap();
}



// ==================================================
// OPEN FEATURE CARD
// ==================================================

function openFeature(card) {

    let cards =
        document.querySelectorAll(".feature-card");


    cards.forEach(function(otherCard) {

        if (otherCard !== card) {

            otherCard.classList.remove("active");

        }

    });


    card.classList.toggle("active");


    // Fix Leaflet map size when Map card opens

    if (
        card.classList.contains("active") &&
        map
    ) {

        setTimeout(function() {

            map.invalidateSize();

        }, 300);

    }

}



// ==================================================
// WEATHER API
// ==================================================

function getWeather() {

    let city =
        document.getElementById("city").value.trim();


    if (city === "") {

        document.getElementById("weatherResult").innerHTML =
            "<p>Please enter a city.</p>";

        return;
    }


    // OpenWeatherMap API key

    let apiKey =
        "95d1b7ffe5e43a07ace628bf39b550bc";


    let url =
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;


    document.getElementById("weatherResult").innerHTML =
        "<p>Loading weather...</p>";


    fetch(url)

        .then(response => response.json())

        .then(data => {

            if (data.cod !== 200) {

                document.getElementById("weatherResult").innerHTML =
                    "<p>City not found.</p>";

                return;
            }


            document.getElementById("weatherResult").innerHTML = `

                <h5>${data.name}</h5>

                <p>
                    Temperature: ${data.main.temp}°C
                </p>

                <img
                    src="https://openweathermap.org/img/w/${data.weather[0].icon}.png"
                    alt="Weather icon"
                >

                <p>
                    ${data.weather[0].description}
                </p>

            `;

        })


        .catch(error => {

            console.error(error);

            document.getElementById("weatherResult").innerHTML =
                "<p>Error fetching weather data.</p>";

        });

}



// ==================================================
// GITHUB API
// ==================================================

function getUser() {

    let username =
        document.getElementById("githubUsername").value.trim();


    if (username === "") {

        document.getElementById("userResult").innerHTML =
            "<p>Please enter a GitHub username.</p>";

        return;
    }


    let url =
        `https://api.github.com/users/${encodeURIComponent(username)}`;


    document.getElementById("userResult").innerHTML =
        "<p>Loading GitHub user...</p>";


    fetch(url)

        .then(response => response.json())

        .then(data => {

            if (data.message === "Not Found") {

                document.getElementById("userResult").innerHTML =
                    "<p>GitHub user not found.</p>";

                return;
            }


            document.getElementById("userResult").innerHTML = `

                <h5>
                    ${data.name || "No Name Found"}
                </h5>

                <img
                    src="${data.avatar_url}"
                    width="100"
                    class="rounded-circle"
                    alt="GitHub profile"
                >

                <p class="mt-2">
                    Public Repos: ${data.public_repos}
                </p>

                <p>
                    Followers: ${data.followers}
                </p>

            `;

        })


        .catch(error => {

            console.error(error);

            document.getElementById("userResult").innerHTML =
                "<p>Error fetching GitHub data.</p>";

        });

}



// ==================================================
// MAP API
// ==================================================

let map = null;

let mapMarker = null;

let mapInitialized = false;



function initializeMap() {

    if (mapInitialized) {

        setTimeout(function() {

            map.invalidateSize();

        }, 300);

        return;
    }


    let mapContainer =
        document.getElementById("live-map");


    if (!mapContainer) {

        return;
    }


    // Create map

    map = L.map("live-map").setView(
        [12.8797, 121.7740],
        6
    );


    // OpenStreetMap tiles

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        }
    ).addTo(map);


    mapInitialized = true;


    // Fix map size

    setTimeout(function() {

        map.invalidateSize();

    }, 300);


    // Get current location

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(

            function(position) {

                let latitude =
                    position.coords.latitude;

                let longitude =
                    position.coords.longitude;


                map.setView(
                    [latitude, longitude],
                    15
                );


                mapMarker =
                    L.marker(
                        [latitude, longitude]
                    )
                    .addTo(map)
                    .bindPopup("Your current location")
                    .openPopup();


                document.getElementById(
                    "location-status"
                ).innerText =
                    "Your location has been found.";

            },


            function(error) {

                document.getElementById(
                    "location-status"
                ).innerText =
                    "Location permission was not allowed.";

            }

        );

    } else {

        document.getElementById(
            "location-status"
        ).innerText =
            "Geolocation is not supported by this browser.";

    }

}



// ==================================================
// MAP SEARCH
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        let searchForm =
            document.getElementById(
                "location-search-form"
            );


        if (searchForm) {

            searchForm.addEventListener(
                "submit",
                function(event) {

                    event.preventDefault();


                    let location =
                        document
                        .getElementById("location-input")
                        .value
                        .trim();


                    let status =
                        document.getElementById(
                            "search-status"
                        );


                    if (location === "") {

                        status.innerText =
                            "Please enter a location.";

                        return;
                    }


                    status.innerText =
                        "Searching...";


                    fetch(
                        "https://nominatim.openstreetmap.org/search?format=json&q=" +
                        encodeURIComponent(location)
                    )

                    .then(response =>
                        response.json()
                    )

                    .then(data => {

                        if (data.length === 0) {

                            status.innerText =
                                "Location not found.";

                            return;
                        }


                        let latitude =
                            parseFloat(data[0].lat);


                        let longitude =
                            parseFloat(data[0].lon);


                        map.setView(
                            [latitude, longitude],
                            15
                        );


                        if (mapMarker) {

                            map.removeLayer(
                                mapMarker
                            );

                        }


                        mapMarker =
                            L.marker(
                                [latitude, longitude]
                            )
                            .addTo(map)
                            .bindPopup(
                                data[0].display_name
                            )
                            .openPopup();


                        status.innerText =
                            "Location found.";

                    })


                    .catch(error => {

                        console.error(error);

                        status.innerText =
                            "Error searching for location.";

                    });

                }
            );

        }

    }
);



// ==================================================
// USER PREFERENCES
// ==================================================

function savePreferences() {

    let theme =
        document.getElementById("theme").value;


    let language =
        document.getElementById("language").value;


    // Save preferences

    localStorage.setItem(
        "theme",
        theme
    );


    localStorage.setItem(
        "language",
        language
    );


    // Apply preferences

    applyPreferences();

    changeLanguage();


    document.getElementById("message").innerText =
        "Preferences saved!";

}



// ==================================================
// APPLY THEME
// ==================================================

function applyPreferences() {

    let theme =
        localStorage.getItem("theme");


    if (theme === "dark") {

        document.body.classList.add(
            "dark-mode"
        );

    } else {

        document.body.classList.remove(
            "dark-mode"
        );

    }


    if (theme) {

        document.getElementById("theme").value =
            theme;

    }

}



// ==================================================
// CHANGE LANGUAGE
// ==================================================

function changeLanguage() {

    let language =
        document.getElementById("language").value;


    localStorage.setItem(
        "language",
        language
    );


    // ================= FILIPINO =================

    if (language === "filipino") {


        // Hero

        document.getElementById("heroTitle").innerText =
            "Maligayang Pagdating sa Aking Laboratoryo";


        document.getElementById("heroDescription").innerText =
            "Tuklasin ang iba't ibang web features na ginawa sa laboratoryo.";


        // Local Storage

        document.getElementById("localStorageTitle").innerText =
            "Local Storage";


        document.getElementById("nameInstruction").innerText =
            "Ilagay ang iyong pangalan upang magpatuloy.";


        document.getElementById("storageUsername").placeholder =
            "Ilagay ang iyong pangalan";


        document.getElementById("continueButton").innerText =
            "Magpatuloy";


        // Weather

        document.getElementById("weatherTitle").innerText =
            "Weather API";


        document.getElementById("weatherDescription").innerText =
            "Suriin ang kasalukuyang panahon sa isang lungsod.";


        document.getElementById("city").placeholder =
            "Ilagay ang pangalan ng lungsod";


        document.getElementById("weatherButton").innerText =
            "Suriin ang Panahon";


        // GitHub

        document.getElementById("githubTitle").innerText =
            "GitHub API";


        document.getElementById("githubDescription").innerText =
            "Maghanap ng GitHub user.";


        document.getElementById("githubUsername").placeholder =
            "Ilagay ang GitHub username";


        document.getElementById("githubButton").innerText =
            "Hanapin ang User";


        // Map

        document.getElementById("mapTitle").innerText =
            "Map API";


        document.getElementById("mapDescription").innerText =
            "Ipakita ang feature ng mapa.";


        document.getElementById("location-input").placeholder =
            "Maghanap ng lugar";

    }


    // ================= ENGLISH =================

    else {


        // Hero

        document.getElementById("heroTitle").innerText =
            "Welcome to My Laboratory";


        document.getElementById("heroDescription").innerText =
            "Explore the different web features created in this laboratory.";


        // Local Storage

        document.getElementById("localStorageTitle").innerText =
            "Local Storage";


        document.getElementById("nameInstruction").innerText =
            "Enter your name to continue.";


        document.getElementById("storageUsername").placeholder =
            "Enter your name";


        document.getElementById("continueButton").innerText =
            "Continue";


        // Weather

        document.getElementById("weatherTitle").innerText =
            "Weather API";


        document.getElementById("weatherDescription").innerText =
            "Check the current weather of a city.";


        document.getElementById("city").placeholder =
            "Enter city name";


        document.getElementById("weatherButton").innerText =
            "Get Weather";


        // GitHub

        document.getElementById("githubTitle").innerText =
            "GitHub API";


        document.getElementById("githubDescription").innerText =
            "Search for a GitHub user.";


        document.getElementById("githubUsername").placeholder =
            "Enter GitHub username";


        document.getElementById("githubButton").innerText =
            "Get User";


        // Map

        document.getElementById("mapTitle").innerText =
            "Map API";


        document.getElementById("mapDescription").innerText =
            "Display the map feature.";


        document.getElementById("location-input").placeholder =
            "Search for a place";

    }

}



// ==================================================
// PAGE LOAD
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        // Apply saved theme

        applyPreferences();


        // Apply saved language

        let savedLanguage =
            localStorage.getItem("language");


        if (savedLanguage) {

            document.getElementById("language").value =
                savedLanguage;

            changeLanguage();

        }

    }
);

