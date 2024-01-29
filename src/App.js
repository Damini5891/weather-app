import React, { useState, useEffect, useCallback } from 'react';
import './App.css'; 

function App() {
  const [weather, setWeather] = useState({
    city: '',
    description: '',
    temp: '',
    humidity: '',
    wind: '',
  });
  const [searchBar, setSearchBar] = useState('');

  const fetchWeather = useCallback(async (city) => {
    try {
      const apiKey = 'e2c1d873e17655abe9c9bdf6946db59d';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      const data = await response.json();
      displayWeather(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }, []);

  const displayWeather = (data) => {
    const { name } = data;
    const { description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    setWeather({
      city: name,
      description,
      temp: `${temp}°C`,
      humidity: `Humidity: ${humidity}%`,
      wind: `Wind Speed: ${speed} km/h`,
    });

    document.body.style.backgroundImage = `url('https://source.unsplash.com/random/1600x900/?${name}')`;
  };

  const handleSearch = () => {
    fetchWeather(searchBar);
  };

  useEffect(() => {
    const getWeatherByLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByLocation(latitude, longitude);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    };

    const fetchWeatherByLocation = async (latitude, longitude) => {
      try {
        const apiKey = 'e2c1d873e17655abe9c9bdf6946db59d';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
        );
        const data = await response.json();
        displayWeather(data);
      } catch (error) {
        console.error('Error fetching weather data by location:', error);
      }
    };

    getWeatherByLocation();
  }, [fetchWeather]); 

  useEffect(() => {
    fetchWeather(weather.city);
  }, [fetchWeather, weather.city]);

  return (
    <div className="card">
      <div className="search">
        <input
          type="text"
          className="search-bar"
          placeholder="Search"
          value={searchBar}
          onChange={(e) => setSearchBar(e.target.value)}
        />
        <button onClick={handleSearch}>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 16 16"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.442 10.442a1 1 0 011.415 0l3.85 3.85a1 1 0 01-1.414 1.415l-3.85-3.85a1 1 0 010-1.415z"
              clipRule="evenodd"
            ></path>
            <path
              fillRule="evenodd"
              d="M6.5 12a5.5 5.5 0 100-11 5.5 5.5 0 000 11zM13 6.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
      <div className={`weather ${weather.city ? '' : 'loading'}`}>
        <h2 className="city">Weather in <span>{weather.city}</span></h2>
        <h1 className="temp">{weather.temp}</h1>
        <div className="description">{weather.description}</div>
        <div className="humidity">{weather.humidity}</div>
        <div className="wind">{weather.wind}</div>
      </div>
    </div>
  );
}

export default App;
