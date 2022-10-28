// "use strict";
const apiToken = "483e43292560865919d8055658066e71";
let DateTime = luxon.DateTime;
const submitButton = document.querySelector("#submitButton");
const todayContainer = document.querySelector(".weatherToday");
let cityName = document.querySelector("#searchInput").value;
const searchHistory = document.querySelector("#searchHistory");
const todaysDate = document.querySelector(".time");
let searchHistoryList = []; //whenever push submit button, append #searchInput textContent into front of this list, display list
//pop out back item of array, only show first five items in array

// todaysDate.textContent = DateTime.now().toFormat("MMMM dd, yyyy");
// DateTime.now().toFormat("MMMM dd, yyyy");

// const forecastDate = function () {
//   for (let i = 0; i <= day.data.length; i++) {}
// };

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

  // for (let i = 0; i <= searchHistoryList.length; i++){
  searchHistoryList.forEach((cityName) => {
    let list = document.createElement("li");
    list.textContent = cityName;
    searchHistory.appendChild(list);
  });
});

// searchHistory.textContent = searchHistoryList; //adding list to text content

const convertKelvinToFarenheit = function (kelvin) {
  const convertedResult = kelvin * 1.8 - 459.67;
  console.log(convertedResult);
  return Math.round(convertedResult);
};

function convertTimestamp(timestamp) {
  var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
    year = d.getFullYear(),
    month = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
    day = ("0" + d.getDate()).slice(-2),
    date = day + "/" + month + "/" + year;
  return date;
}

// const convertTimeStamp = function (timeStamp) {
//   let d = new Date(timeStamp * 1000);
//   let day = date.getDay(timeStamp);
//   let month = date.getMonth(timeStamp);
//   let year = date.getFullYear(timeStamp);
//   let dateFormat = day + "/" + month + "/" + year;
//   return dateFormat;
// };

const locationData = function (cityName) {
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiToken}`
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

const getWeather = function (lat, lon) {
  const setWeatherInfo = function (
    { temp, wind_speed, humidity, dt }, //added dt
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
  if (localStorage.getItem("date")) {
    //set five day forecast in if statement
    setWeatherInfo(
      {
        temp: localStorage.getItem("temp"),
        wind_speed: localStorage.getItem("wind"),
        humidity: localStorage.getItem("humidity"),
        dt: localStorage.getItem("date"),
      },
      "*[data-today]"
    );
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

        setWeatherInfo(
          {
            dt: data.current.dt,
            temp: data.current.temp,
            wind_speed: data.current.wind_speed,
            humidity: data.current.humidity,
          },
          "*[data-today]"
        );

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
//remove before submitting
// getWeather(32.741947, -117.239571);

//make a for loop that matches data index of day with data index of weather forecast
