// global variables
var cityHistory;
var mainVisible = false;

// content elements
var historyEl = document.getElementById("history");

// current weather block
var mainEl = document.getElementById("main");
var cityEl = document.getElementById("city");
var dateEl = document.getElementById("date");
var iconEl = document.getElementById("icon");
var tempEl = document.getElementById("temperature");
var windEl = document.getElementById("wind");
var humidEl = document.getElementById("humidity");
var uvEl = document.getElementById("UV-index");

var forecastEl = document.getElementById("forecast");

// form elements
var inputEl = document.getElementById("city-input");
var searchEl = document.getElementById("search");

// event listeners
searchEl.addEventListener("click", searchWeather);
historyEl.addEventListener("click", historyWeather);


// initialize page
init();

// functions
function init() {
    mainEl.style.visibility = "hidden";
    cityHistory = JSON.parse(localStorage.getItem("history"));
    if (!cityHistory) {
        cityHistory = [];
    }
    appendHistory();
}

// main function
async function searchWeather(event) {
    event.preventDefault();
    var userInput = inputEl.value;
    inputEl.value = "";
    if (!userInput) {
        return;
    }
    var targetCity = await getGeo(userInput);
    if (!targetCity) {
        return;
    }
    addHistory(targetCity);
    getWeather(targetCity);
    if (!mainVisible) {
        mainEl.style.visibility = "unset";
    }
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
    var requestWeatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + targetCity.lat + "&lon=" + targetCity.lon + "&units=imperial&appid=64b2c0c672fd03d5a6f0b210f2de7e71";
    
    fetch(requestWeatherURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            appendCurrWeather(data.current, targetCity.name);
            append5Day(data.daily);
        });
}

function appendCurrWeather(current, name) {
    cityEl.textContent = name + " ";
    dateEl.textContent = moment().format("M/D/YYYY");
    iconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + current.weather[0].icon + ".png")
    iconEl.setAttribute("alt", current.weather[0].description);

    tempEl.textContent = current.temp + "°F";
    windEl.textContent = current.wind_speed + "MPH";
    humidEl.textContent = current.humidity + "%";

    uvNum = current.uvi;
    uvEl.textContent = uvNum;
    if (uvNum < 3) {
        uvEl.className = "favorable";
    } else if (uvNum >= 3 && uvNum <= 7) {
        uvEl.className = "moderate";
    } else {
        uvEl.className = "severe";
    }
}

function append5Day(daily) {
    forecastEl.textContent = "";
    for (i = 0; i < 5; i++) {
        var newDiv = document.createElement("div");
        newDiv.className = "forecast-card";

        var newDate = document.createElement("h3");
        newDate.textContent = moment().add(i + 1, "d").format("M/D/YYYY");

        var newIcon = document.createElement("img");
        newIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + daily[i].weather[0].icon + ".png")
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

function addHistory(targetCity) {
    for (i = 0; i < cityHistory.length; i++) {
        if (targetCity.name === cityHistory[i].name) {
            targetCity = cityHistory.splice(i, 1)[0];
            i = cityHistory.length;
        }
    }
    if (cityHistory.length === 10) {
        cityHistory.shift();
    }
    cityHistory.push(targetCity);
    localStorage.setItem("history", JSON.stringify(cityHistory));
    appendHistory();
}

function appendHistory() {
    historyEl.textContent = "";
    for (i = cityHistory.length - 1; i >= 0; i--) {
        var newLi = document.createElement("li");

        var newButton = document.createElement("button");
        newButton.textContent = cityHistory[i].name;
        newButton.setAttribute("index", i);

        newLi.append(newButton);
        historyEl.append(newLi);
    }
}

function historyWeather(event) {
    if (event.target.matches("button")) {
        var index = event.target.getAttribute("index");
        targetCity = cityHistory[index];
        addHistory(targetCity);
        getWeather(targetCity);
        if (!mainVisible) {
            mainEl.style.visibility = "unset";
        }
    }
}

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