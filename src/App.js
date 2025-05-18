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

  const darkMode = true; // default to dark mode

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

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const match = suggestions.find(
        (c) =>
          `${c.name}, ${c.country}`.toLowerCase() === query.trim().toLowerCase()
      );
      if (match) {
        onSelectCity(match);
      } else {
        setError("Please select a city from the list.");
      }
    }
  };

  useEffect(() => {
    if (!selectedCity || !apiKey) return;
    fetchWeatherData(selectedCity.lat, selectedCity.lon, apiKey)
      .then((data) => {
        setWeatherData(data);
        setError("");
      })
      .catch(() => setError("Failed to fetch weather data"));
  }, [selectedCity]);

  return (
    <div className={darkMode ? "dark" : "light"}>
      <div className="container">
        <h1>Weather App</h1>

        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter OpenWeatherMap API Key"
          className="apikey"
        />

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
            <WeatherChart daily={weatherData.daily} />
          </div>
        )}
      </div>

      <style>{`
        body, html {
          margin: 0; padding: 0; font-family: Arial, sans-serif;
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
        input[type=text] {
          width: 100%;
          padding: 10px;
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
          background: #2a2a2a;
          border: 1px solid #555;
          margin-bottom: 20px;
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
          color: inherit;
        }
        .suggestions li {
          padding: 10px;
          cursor: pointer;
          border-bottom: 1px solid #444;
        }
        .suggestions li:hover {
          background: #333;
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
