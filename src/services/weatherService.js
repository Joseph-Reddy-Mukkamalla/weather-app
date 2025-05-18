import axios from "axios";

export const fetchWeatherData = async (lat, lon, apiKey) => {
  const res = await axios.get("https://api.openweathermap.org/data/2.5/onecall", {
    params: {
      lat,
      lon,
      exclude: "minutely,hourly,alerts",
      units: "metric",
      appid: apiKey,
    },
  });
  return res.data;
};
