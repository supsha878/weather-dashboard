// global variables
var history = [];

// content elements
var cityEl = document.getElementById("city");
var historyEl = document.getElementById("history");

// form elements
var inputEl = document.getElementById("city-input");
var searchEl = document.getElementById("search");

searchEl.addEventListener("click", searchWeather);

// main function - TODO split up into multiple
async function searchWeather(event) {
    event.preventDefault();
    if (!inputEl.value) {
        return;
    }

    var cityLocation = await getGeo(inputEl.value);
    getWeather(cityLocation[1], cityLocation[2]);
}


function getGeo(cityName, callback) {
    var requestGeoURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=64b2c0c672fd03d5a6f0b210f2de7e71";

    // retrieves name, latitude, and longitude from API
    //var promiseObj =
    return fetch(requestGeoURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
                if (data.length == 0) {
                return;
            }

            var name = data[0].name;
            var lat = data[0].lat;
            var lon = data[0].lon;

            return [name, lat, lon];
        });
}

function getWeather(lat, lon) {
    if (!lat || !lon) {
        return;
    }
    var requestWeatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=64b2c0c672fd03d5a6f0b210f2de7e71"
    
    fetch(requestWeatherURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}

function addHistory(name, lat, lon) {
    var newLi = document.createElement("li");
    var newButton = document.createElement("button");
    newButton.textContent = name;
    newButton.setAttribute("lat", lat);
    newButton.setAttribute("lon", lon);
    newLi.append(newButton);
    historyEl.append(newLi);
    // TODO local storage
    // TODO use objects to store
    // check array before adding etc etc
}

function appendCurrWeather() {
    //THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

    
}



// icon URL



// fetch("https://api.openweathermap.org/data/2.5/onecall?lat=47.6038321&lon=-122.3300624&units=imperial&appid=64b2c0c672fd03d5a6f0b210f2de7e71")
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (data) {
//         console.log(data);
//     })

// API: 64b2c0c672fd03d5a6f0b210f2de7e71


// API Call: https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&units=imperial&appid={API key}


// Geo Call: http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}