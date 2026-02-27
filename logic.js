const searchInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.btn-search');

const weatherInfoSection = document.querySelector('.weather-info');
const searchCitySection = document.querySelector('.search-city');
const notFoundSection = document.querySelector('.not-found');

const countryTxt = document.querySelector('.country-txt');
const currentDateTxt = document.querySelector('.current-date-txt');
const weatherSummaryImage = document.querySelector('.weather-summary-img');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityTxt = document.querySelector('.humidity-value-txt');
const windTxt = document.querySelector('.wind-value-txt');

const forecastItemsContainer = document.querySelector(
  '.forecast-items-container',
);

const apiKey = '170bdbfa8337b05b83d4579d54df499f';

searchBtn.addEventListener('click', () => {
  if (searchInput.value.trim() != '') {
    updateWeatherInfo(searchInput.value);
    searchInput.value = '';
    searchInput.blur();
  }
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key == 'Enter' && searchInput.value.trim() != '') {
    updateWeatherInfo(searchInput.value);
    searchInput.value = '';
    searchInput.blur();
  }
});

async function getFetchData(endPoint, city) {
  const url = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
  const respons = await fetch(url);
  const weatherData = await respons.json();
  return weatherData;
}

function getWeatherIcon(id) {
  if (id <= 232) return 'thunderstorm.svg';
  if (id <= 321) return 'drizzle.svg';
  if (id <= 531) return 'rain.svg';
  if (id <= 622) return 'snow.svg';
  if (id <= 781) return 'atmosphere.svg';
  if (id <= 800) return 'clear.svg';
  else return 'clouds.svg';
}

function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  };

  return currentDate.toLocaleDateString('en-GB', options);
}

async function updateWeatherInfo(city) {
  const weatherData = await getFetchData('weather', city);

  if (weatherData.cod != 200) {
    showdisplaySection(notFoundSection);
    return;
  }

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  countryTxt.textContent = country;
  weatherSummaryImage.src = `assets/weather/${getWeatherIcon(id)}`;
  tempTxt.textContent = Math.round(temp) + ' ℃';
  conditionTxt.textContent = main;
  humidityTxt.textContent = humidity + ' %';
  windTxt.textContent = speed + ' M/s';
  currentDateTxt.textContent = getCurrentDate();

  await updateForecastsInfo(city);

  showdisplaySection(weatherInfoSection);
}

async function updateForecastsInfo(city) {
  const forecastData = await getFetchData('forecast', city);

  const timeTaken = '12:00:00';
  const todayDate = new Date().toISOString().split('T')[0];

  forecastItemsContainer.innerHTML = '';
  forecastData.list.forEach((forecast) => {
    if (
      forecast.dt_txt.includes(timeTaken) &&
      !forecast.dt_txt.includes(todayDate)
    ) {
      updateForecastItems(forecast);
    }
  });
}

function updateForecastItems(forecast) {
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = forecast;

  const dateTaken = new Date(date);
  const options = {
    day: '2-digit',
    month: 'short',
  };

  const dateResult = dateTaken.toLocaleString('en-US', options);

  const forecastItem = `
    <div class="forecast-item">
        <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
        <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
        <h5 class="forecast-item-temp">${Math.round(temp)} ℃</h5>
    </div>
    `;
  forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem);
}

function showdisplaySection(section) {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach(
    (section) => (section.style.display = 'none'),
  );

  section.style.display = 'flex';
}
