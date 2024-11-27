import "./style/app.css";

import searchIcon from "./assets/search.png";
import cleardayIcon from "./assets/clearday.png";
import clearNightIcon from "./assets/clearnight.png";
import brokenIcon from "./assets/brokenclouds.png";
import dayrainIcon from "./assets/cloudy.png";
import nightrainIcon from "./assets/rain.png";
import cloudIcon from "./assets/cloud.png";
import drizzleIcon from "./assets/drizzle.png";
import scatterIcon from "./assets/scatteredclouds.png";
import snowIcon from "./assets/snow.png";
import humidityIcon from "./assets/humidity.png";
import nightSnowIcon from "./assets/snownight.png";
import { useState, useEffect } from "react";

const App = () => {
  const [data, setData] = useState({}); // Use `data` for single weather object
  const [location, setLocation] = useState(""); // Initial location
  const [error, setError] = useState(null); // State to store API error
  const [weatherIcon, setWeatherIcon] = useState(null); // Weather icon
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  // weather icon images
  const weatherIconMap = {
    "01d": cleardayIcon,
    "01n": clearNightIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": scatterIcon,
    "03n": scatterIcon,
    "04d": brokenIcon,
    "04n": brokenIcon,
    "09d": drizzleIcon,
    "09n": drizzleIcon,
    "10d": dayrainIcon,
    "10n": nightrainIcon,
    "13d": snowIcon,
    "13n": nightSnowIcon,
  };


  const formatTime=(timezone)=>{
     if (timezone===undefined)return "unavailable";

     const utcTime= Date.now();

     const localOffset = new Date().getTimezoneOffset() *60 *1000;
     const localTime = new Date(utcTime + timezone * 1000 + localOffset);

     return new Intl.DateTimeFormat("en-US", {
      hour:"2-digit",
      minute:"2-digit",
      second: "2-digit",
      hour12:true,
     }).format(localTime);

  }

  // Main function whcih fetch the api from openweathermap
  const fetchWeather = async () => {
    setLoading(true);
    try {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=874884f2546a71954d2a7e0a5888ded0&units=Metric`;
      const response = await fetch(apiUrl);
      const fetchedData = await response.json();

      if (fetchedData.cod == 404) {
        handleCityNotFound();
        //  setData({})
        //  throw new Error('An error appeared while fetching data ');
      }

      console.log(`city : ${cityNotFound}`);
      setData(fetchedData);
      console.log(` data : ${JSON.stringify(data)}`);
      // fetching the wether icon to change the weather icon based on the location
      const weatherIconCode = fetchedData.weather?.[0]?.icon;
      setWeatherIcon(weatherIconMap[weatherIconCode] || cleardayIcon);
      setCityNotFound(false);
    } catch (error) {
      setError(error.message);
    }
    finally{
      setLoading(false)
    }
  };

  // This is used to call fetched weather on component mount
  useEffect(() => {
    fetchWeather();
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchWeather();
      // Whenever user fill te input and press eneter the fettched data will visible based on the location
    }
  };
  // if user type unknown or wrong city nam eerror message shoud appear as cit not found

  const handleCityNotFound = () => {
    setCityNotFound(true);
    setLoading(false); // Stop displaying the loading indicator
    setError(null); // Clear any previous error message
  };

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className="cityInput"
            placeholder="City Name"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            onKeyDown={handleKeyPress} // Trigger fetch on Enter press
          />

          <div className="search-icon" onClick={() => fetchWeather()}>
            <img src={searchIcon} alt="Search icon" />
          </div>
        </div>

        <div className="weather-details">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>City Not Found</div>
          ) : data?.weather ? (
            // Object.keys(data).length > 0 ?
            <>
              <div className="weather-icon">
                <img src={weatherIcon} alt="Weather icon" />
              </div>
              <div className="weather-info">
                <div className="description">
                  {data.weather?.[0]?.description}
                </div>
                <div className="location">{data.name}</div>
                <div className="country">{data.sys?.country}</div>
                <div className="temperature">{data.main?.temp}°C</div>

                <div className="humidity">
                  <img src={humidityIcon} alt="Weather Forecast" />
                  Humidity Level: {data.main?.humidity}%
                </div>

                {/* <div className="sea-level">
                  Sea Level : {data.main?.sea_level}
                </div> */}
                <div className="time">
                  <span className="time-label">Time:</span>
                  <span className="time-value">{formatTime(data.timezone)}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="enter-city-message">
              Enter a city to see the weather.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
