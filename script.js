// "use strict";
const apiToken = "483e43292560865919d8055658066e71";

const submitButton = document.querySelector("#submitButton");
const todayContainer = document.querySelector(".weatherToday");
let cityName = document.querySelector("#searchInput").value;
const searchHistory = document.querySelector("#searchHistory");
const todaysDate = document.querySelector(".time");
let searchHistoryList = []; //whenever push submit button, append #searchInput textContent into front of this list, display list
//pop out back item of array, only show first five items in array

//When click submit button, text content of daily forecast boxes are set according to api data
submitButton.addEventListener("click", function (event) {
  event.preventDefault();
  searchHistory.innerHTML = "";
  let cityName = document.querySelector("#searchInput").value;
  locationData(cityName);
  searchHistoryList.unshift(cityName);
  localStorage.clear();

  if (searchHistoryList.length > 5) {
    searchHistoryList.pop(searchHistoryList[5]);
  }

  searchHistoryList.forEach((cityName) => {
    let list = document.createElement("li");
    list.textContent = cityName;
    searchHistory.appendChild(list);
  });
});
//convert kelvin to farenheit function
const convertKelvinToFarenheit = function (kelvin) {
  const convertedResult = kelvin * 1.8 - 459.67;
  console.log(convertedResult);
  return Math.round(convertedResult);
};
//convert unix timestamp to day/ month tear format
function convertTimestamp(timestamp) {
  var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
    year = d.getFullYear(),
    month = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
    day = ("0" + d.getDate()).slice(-2),
    date = day + "/" + month + "/" + year;
  return date;
}
//call geocode api which provides latitude and longitude of city name for weather api to use
const locationData = function (cityName) {
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiToken}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const firstObject = data[0];
      lon = firstObject.lon;
      lat = firstObject.lat;
      console.log(lat);
      console.log(lon);
      getWeather(lat, lon);
    });
};
//Review with Mathias
//setting weather data into the html through the dom
const getWeather = function (lat, lon) {
  const setWeatherInfo = function (
    { temp, wind_speed, humidity, dt },
    selector
  ) {
    let timeSelector = `${selector} .time`;
    let tempSelector = `${selector} .temp`;
    let windSelector = `${selector} .wind`;
    let humSelector = `${selector} .humidity`;
    let timeElement = document.querySelector(timeSelector);
    let tempElement = document.querySelector(tempSelector);
    let windElement = document.querySelector(windSelector);
    let humElement = document.querySelector(humSelector);
    timeElement.textContent = convertTimestamp(dt);
    tempElement.textContent =
      "Temperature: " + convertKelvinToFarenheit(temp) + "℉";
    windElement.textContent = "Wind: " + wind_speed + "mph";
    humElement.textContent = "Humidity: " + humidity + "%";
  };

  //set weather conditions in local storage to optimize search speed, if no new information
  //pull data from local storage
  if (localStorage.getItem("date")) {
    setWeatherInfo(
      {
        temp: localStorage.getItem("temp"),
        wind_speed: localStorage.getItem("wind"),
        humidity: localStorage.getItem("humidity"),
        dt: localStorage.getItem("date"),
      },
      "*[data-today]"
    );
    //if no local storage perisists in cache, make fetch call to api for fresh data
  } else {
    fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&units=standard&appid=${apiToken}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("daily", data, data.daily);
        localStorage.setItem("date", data.current.dt);
        localStorage.setItem("temp", data.current.temp);
        localStorage.setItem("wind", data.current.wind_speed);
        localStorage.setItem("humidity", data.current.humidity);
        //pull current weather for the day from api
        setWeatherInfo(
          {
            dt: data.current.dt,
            temp: data.current.temp,
            wind_speed: data.current.wind_speed,
            humidity: data.current.humidity,
          },
          "*[data-today]"
        );
        //pull data for 5 day forecast from api
        for (let i = 0; i <= data.daily.length; i++) {
          setWeatherInfo(
            {
              dt: data.daily[i].dt,
              temp: data.daily[i].temp.day,
              wind_speed: data.daily[i].wind_speed,
              humidity: data.daily[i].humidity,
            },
            `*[data-index="${i}"]`
          );
        }
      });
  }
};
