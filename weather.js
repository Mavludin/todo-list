// SELECT ELEMENTS
const iconElement = document.getElementById('weather-icon');
const tempElement = document.getElementById('temperature-value');
const descElement = document.getElementById('temperature-description');
const locationElement = document.getElementById('location');
const notificationElement = document.getElementById('weather-notification');

// App data
const weather = {};

weather.temperature = {
	unit : "celcius"
}

//APP CONST AND VARS
const KELVIN = 273;
//API KEY
const key = "34140d96c2ad22d503d80004ffc14544";

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if ('geolocation' in navigator) {
	navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
	notificationElement.style.display = "block";
	notificationElement.innerHTML = "<p>Browser doesn't support Geolocation</p>";
}

// SET USER'S POSITION
function setPosition(position) {
	let latitude = position.coords.latitude;
	let longitude = position.coords.longitude;
	getWeather(latitude, longitude);
}

// SHOW ERROR THERE IN AN ISSUE WITH GEOLOCATION
function showError(error) {
	notificationElement.style.display = "block";
	notificationElement.innerHTML = `<p>${error.message}</p>`;	
}

// GET WEATHER
function getWeather(latitude, longitude) {
	let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${key}`;
	fetch(api)
		.then(function(response) {
			let data = response.json();
			return data;
		})
		.then(function(data) {
			weather.temperature.value = Math.floor(data.main.temp - KELVIN);
			weather.description = data.weather[0].description;
			weather.description = weather.description[0].toUpperCase() + weather.description.slice(1);
			weather.iconId = data.weather[0].icon;
			weather.city = data.name;
			weather.country = data.sys.country;

		})
		.then(function() {
			displayWeather();
		})
		.catch(function() {
			console.log("The call has not been sent");
		})
}

// DISPLAY WEATHER
function displayWeather() {
	iconElement.src = `icons/${weather.iconId}.png`;
	iconElement.alt = weather.description;
	tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
	descElement.innerHTML = weather.description;
	locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// C to F convertion
function celsiusToFahrenheit(temperature) {
	return (temperature * 9/5) + 32;
}

// CLICK ON TEMPERATURE ELEMENT
tempElement.addEventListener('click', function() {
	if (weather.temperature.value === undefined) return;

	if (weather.temperature.unit == 'celcius') {
		let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
		fahrenheit = Math.floor(fahrenheit);
		tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
		weather.temperature.unit = 'fahrenheit';
	}else {
		tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
		weather.temperature.unit = 'celcius';
	}
});