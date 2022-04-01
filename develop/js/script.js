// global variables
var history = [];
var historyIndex = 0;

// content elements
var historyEl = document.getElementById("history");

// current weather block
var cityEl = document.getElementById("city");
var dateEl = document.getElementById("date");
var iconEl = document.getElementById("icon");
var tempEl = document.getElementById("temperature");
var windEl = document.getElementById("wind");
var humidEl = document.getElementById("humidity");
var uvEl = document.getElementById("UV-index");

var forecastEl = document.getElementById("5-day");

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

    //TODO content reset
    forecastEl.textContent = "";

    var targetCity = await getGeo(inputEl.value);
    history.push(targetCity);
    // Append to history TODO figure out order-- weather then history?
    addHistory();
    getWeather(targetCity);
}


function getGeo(cityName) {
    var requestGeoURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=64b2c0c672fd03d5a6f0b210f2de7e71";

    // retrieves name, latitude, and longitude from API
    return fetch(requestGeoURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
                if (data.length == 0) {
                return;
            }

            var targetCity = {
                name: data[0].name,
                lat: data[0].lat,
                lon: data[0].lon
            }

            return targetCity;
        });
}

function getWeather(targetCity) {
    if (!targetCity) { // TODO make sure this works still array->object
        return;
    }
    var requestWeatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + targetCity.lat + "&lon=" + targetCity.lon + "&units=imperial&appid=64b2c0c672fd03d5a6f0b210f2de7e71";
    
    fetch(requestWeatherURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            appendCurrWeather(data.current, targetCity.name);
            append5Day(data.daily);
        });
}

function appendCurrWeather(current, name) {
    cityEl.textContent = name;
    dateEl.textContent = moment().format("M/D/YYYY");
    iconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + current.weather[0].icon + "@2x.png")
    iconEl.setAttribute("alt", current.weather[0].description);
    tempEl.textContent = "Temp: " + current.temp + "°F";
    windEl.textContent = "Wind: " + current.wind_speed + "MPH";
    humidEl.textContent = "Humidity: " + current.humidity + "%";
    uvEl.textContent = "UV Index: " + current.uvi;
}

function append5Day(daily) {
    for (i = 0; i < 5; i++) {
        var newDiv = document.createElement("div");
        newDiv.classList.add("forecast-card");

        var newDate = document.createElement("h3");
        newDate.textContent = moment().add(i + 1, "d").format("M/D/YYYY");

        var newIcon = document.createElement("img");
        newIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + daily[i].weather[0].icon + "@2x.png")
        newIcon.setAttribute("alt", daily[i].weather[0].description);

        var newTemp = document.createElement("p");
        newTemp.textContent = "Temp: " + daily[i].temp.day + "°F";

        var newWind = document.createElement("p");
        newWind.textContent = "Wind: " + daily[i].wind_speed + "MPH";

        var newHumid = document.createElement("p");
        newHumid.textContent = "Humidity: " + daily[i].humidity + "%";

        newDiv.append(newDate, newIcon, newTemp, newWind, newHumid);
        forecastEl.append(newDiv);
    }
}


function addHistory() {
    /* check if object exists? --line 67 TODO

    Check if its in history already, if it is move it to the top

    create button within li and attach to historyEl
    add index for event listener purposes

    
    index++
    
    */
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


// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity


// icon URL http://openweathermap.org/img/wn/{}@2x.png



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