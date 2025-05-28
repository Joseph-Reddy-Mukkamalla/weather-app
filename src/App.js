import { useState, useEffect } from "react";
import axios from "axios";
import { fetchWeatherData } from "./services/weatherService";
import WeatherChart from "./components/WeatherChart";

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const darkMode = true; // default to light mode

  const fetchCities = async (text) => {
    if (!text || !apiKey) return;
    try {
      const res = await axios.get(
        "https://api.openweathermap.org/geo/1.0/direct",
        {
          params: { q: text, limit: 5, appid: apiKey },
        }
      );
      setSuggestions(res.data);
    } catch {
      setSuggestions([]);
    }
  };

  const onInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    fetchCities(val);
  };

  const onSelectCity = (city) => {
    setSelectedCity(city);
    setQuery(`${city.name}, ${city.country}`);
    setSuggestions([]);
  };

  const onKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0) {
        onSelectCity(suggestions[0]);
      } else {
        try {
          const res = await axios.get("https://api.openweathermap.org/geo/1.0/direct", {
            params: { q: query, limit: 1, appid: apiKey },
          });
          if (res.data && res.data.length > 0) {
            onSelectCity(res.data[0]);
          } else {
            setError("Please type a valid city name.");
          }
        } catch {
          setError("Please type a valid city name.");
        }
      }
    }
  };

  useEffect(() => {
    if (!selectedCity || !apiKey) return;
    const fullCity = `${selectedCity.name},${selectedCity.country}`;
    fetchWeatherData(fullCity, apiKey)
      .then((data) => {
        setWeatherData(data);
        setError("");
      })
      .catch(() => setError("Failed to fetch weather data"));
  }, [selectedCity, apiKey]);

  return (
    <div className={darkMode ? "dark" : "light"}>
      <div className="container">
        <h1>Weather App</h1>

        <div style={{ position: "relative" }}>
          <input
            type={showApiKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter OpenWeatherMap API Key"
            className="apikey"
          />
          <span
            onClick={() => setShowApiKey((prev) => !prev)}
            className="eye-button"
          >
            {showApiKey ? (
              <svg viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.20-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
              </svg>
            )}
          </span>
        </div>

        <input
          type="text"
          value={query}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          placeholder="Type city name and select"
          autoComplete="off"
        />

        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((city) => (
              <li
                key={`${city.lat}-${city.lon}`}
                onClick={() => onSelectCity(city)}
              >
                {city.name}, {city.country}
              </li>
            ))}
          </ul>
        )}

        {error && <p className="error">{error}</p>}

        {weatherData && (
          <div className="weather-section">
            <h2>
              Weather for {selectedCity.name}, {selectedCity.country}
            </h2>
            <WeatherChart list={weatherData.list} />
          </div>
        )}
      </div>

      <style>{`
        body, html {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
        }
        .dark {
          background: #121212;
          color: #eee;
          min-height: 100vh;
          padding: 20px 0;
        }
        .light {
          background: #f0f0f0;
          color: #222;
          min-height: 100vh;
          padding: 20px 0;
        }
        .container {
          max-width: 600px;
          margin: auto;
          padding: 0 20px;
        }
        h1 {
          margin-bottom: 20px;
        }
        input[type=text], input[type=password] {
          width: 100%;
          padding: 10px;
          padding-right: 40px;
          font-size: 16px;
          border-radius: 4px;
          border: 1px solid #444;
          outline: none;
          box-sizing: border-box;
          background: #1e1e1e;
          color: #eee;
          margin-bottom: 10px;
        }
        input.apikey {
          background: #1e1e1e;
          border: 1px solid #555;
          margin-bottom: 20px;
        }
        .light input[type=text], .light input[type=password] {
          background: #ffffff;
          color: #222;
          border: 1px solid #444;
        }
        .light input.apikey {
          background: #ffffff;
          color: #222;
          border: 1px solid #444;
          margin-bottom: 20px;
        }
        .eye-button {
          position: absolute;
          right: 10px;
          top: 35%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          fill: #aaa;
          width: 24px;
          height: 24px;
        }
        .light .eye-button {
          fill: #333;
        }
        .suggestions {
          list-style: none;
          padding: 0;
          margin: 0;
          border: 1px solid #555;
          border-top: none;
          max-height: 150px;
          overflow-y: auto;
          background: #222;
          border-radius: 0 0 4px 4px;
          color: #eee;
        }
        .suggestions li {
          padding: 10px;
          cursor: pointer;
          border-bottom: 1px solid #444;
        }
        .suggestions li:hover {
          background: #333;
        }
        .light .suggestions {
          background: #ffffff;
          color: #222;
          border: 1px solid #444;
          border-top: none;
        }
        .light .suggestions li {
          border-bottom: 1px solid #ccc;
        }
        .light .suggestions li:hover {
          background: #e0e0e0;
        }
        .error {
          color: #e74c3c;
          margin-top: 10px;
        }
        .weather-section {
          margin-top: 30px;
        }
      `}</style>
    </div>
  );
}