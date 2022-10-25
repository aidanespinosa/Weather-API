// "use strict";
const apiToken = "483e43292560865919d8055658066e71";
const submitButton = document.querySelector("#submitButton");
const todayContainer = document.querySelector(".weatherToday");
// var cityName = document.querySelector("#searchInput");
submitButton.addEventListener("click", function () {
  let cityName = document.querySelector("#searchInput").value;
  locationData(cityName);
});

const locationData = function (cityName) {
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit={limit}&appid=${apiToken}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      getWeather(data.lat, data.lon);
      lat = data.lat;
      lon = data.lon;
      console.log(lat);
      console.log(lon);
    });
};

const getWeather = function (lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${apiToken}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data.daily);
      for (let i = 0; i <= data.daily.length; i++) {
        let dailyIndex = `*[data-index="${i}"] .temp`;
        let day = document.querySelector(dailyIndex);
        day.textContent = data.daily[i].temp.day;
        console.log(day);
        console.log(data.daily[i]);
      }
    });
};
//remove before submitting
getWeather(32.741947, -117.239571);

//make a for loop that matches data index of day with data index of weather forecast
