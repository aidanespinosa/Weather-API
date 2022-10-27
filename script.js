// "use strict";
const apiToken = "483e43292560865919d8055658066e71";
const submitButton = document.querySelector("#submitButton");
const todayContainer = document.querySelector(".weatherToday");
let cityName = document.querySelector("#searchInput").value;
const searchHistory = document.querySelector("#searchHistory");
let searchHistoryList = []; //whenever push submit button, append #searchInput textContent into front of this list, display list
//pop out back item of array, only show first five items in array

submitButton.addEventListener("click", function (event) {
  event.preventDefault();
  let cityName = document.querySelector("#searchInput").value;
  locationData(cityName);
  searchHistoryList.unshift(cityName);

  if (searchHistoryList.length > 5) {
    searchHistoryList.pop(searchHistoryList[5]);
  }

  // for (let i = 0; i <= searchHistoryList.length; i++)
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
  fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&units=standard&appid=${apiToken}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("daily", data, data.daily);

      const setWeatherInfo = function (
        { temp, wind_speed, humidity },
        selector
      ) {
        let tempSelector = `${selector} .temp`;
        let windSelector = `${selector} .wind`;
        let humSelector = `${selector} .humidity`;
        let tempElement = document.querySelector(tempSelector);
        let windElement = document.querySelector(windSelector);
        let humElement = document.querySelector(humSelector);
        tempElement.textContent =
          "Temperature: " + convertKelvinToFarenheit(temp) + "℉";
        windElement.textContent = "Wind: " + wind_speed + "mph";
        humElement.textContent = "Humidity: " + humidity + "%";
      };
      setWeatherInfo(
        {
          temp: data.current.temp,
          wind_speed: data.current.wind_speed,
          humidity: data.current.humidity,
        },
        "*[data-today]"
      );

      for (let i = 0; i <= data.daily.length; i++) {
        setWeatherInfo(
          {
            temp: data.daily[i].temp.day,
            wind_speed: data.daily[i].wind_speed,
            humidity: data.daily[i].humidity,
          },
          `*[data-index="${i}"]`
        );
      }
    });
};
//remove before submitting
// getWeather(32.741947, -117.239571);

//make a for loop that matches data index of day with data index of weather forecast
