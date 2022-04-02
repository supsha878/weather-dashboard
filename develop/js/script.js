// global variables
var cityHistory;
var mainVisible = false;

// content elements
var mainEl = document.getElementById("main");
var historyEl = document.getElementById("history");
var forecastEl = document.getElementById("forecast");

// current weather elements
var cityEl = document.getElementById("city");
var dateEl = document.getElementById("date");
var iconEl = document.getElementById("icon");
var tempEl = document.getElementById("temperature");
var windEl = document.getElementById("wind");
var humidEl = document.getElementById("humidity");
var uvEl = document.getElementById("UV-index");

// form elements
var inputEl = document.getElementById("city-input");
var searchEl = document.getElementById("search");

// event listeners
searchEl.addEventListener("click", searchWeather);
historyEl.addEventListener("click", historyWeather);

// initialize page
init();

// functions

// initialize function
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

    // validates input
    if (!userInput) {
        return;
    }

    // first data retrieval
    var targetCity = await getGeo(userInput);
    // validate returned object
    if (!targetCity) {
        return;
    }

    // adds city to history
    addHistory(targetCity);
    // second data retrieval
    getWeather(targetCity);

    if (!mainVisible) {
        mainEl.style.visibility = "unset";
    }
}

// retrieves geo data to locate lat & lon
function getGeo(cityName) {

    var requestGeoURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=64b2c0c672fd03d5a6f0b210f2de7e71";

    // retrieves name, latitude, and longitude and returns as object
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

// retrieves weather data using lat & lon from earlier fetch
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

// appends current day's weather, and sets safety class for UV index
function appendCurrWeather(current, name) {
    cityEl.textContent = name + " ";
    dateEl.textContent = moment().format("M/D/YYYY");
    iconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + current.weather[0].icon + ".png")
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

// appends 5 day forecast using forloop
function append5Day(daily) {
    forecastEl.textContent = "";
    for (i = 0; i < 5; i++) {
        var newDiv = document.createElement("div");
        newDiv.className = "forecast-card";

        var newDate = document.createElement("h3");
        newDate.textContent = moment().add(i + 1, "d").format("M/D/YYYY");

        var newIcon = document.createElement("img");
        newIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + daily[i].weather[0].icon + ".png")
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

// adds successfully searched city to history list
function addHistory(targetCity) {
    // checks if city has already been searched
    for (i = 0; i < cityHistory.length; i++) {
        if (targetCity.name === cityHistory[i].name) {
            targetCity = cityHistory.splice(i, 1)[0];
            i = cityHistory.length;
        }
    }
    // keeps cities stored at or below 10
    if (cityHistory.length === 10) {
        cityHistory.shift();
    }
    cityHistory.push(targetCity);
    // store history list in local storage
    localStorage.setItem("history", JSON.stringify(cityHistory));
    appendHistory();
}

// appends history list to page
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

// accesses data of an already searched city and appends it to the page
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
