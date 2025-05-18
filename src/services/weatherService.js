import axios from "axios";

export const fetchWeatherData = async (city, apiKey) => {
  const res = await axios.get("https://api.openweathermap.org/data/2.5/forecast", {
    params: {
      q: city,
      units: "metric",
      appid: apiKey,
    },
  });
  return res.data;
};
