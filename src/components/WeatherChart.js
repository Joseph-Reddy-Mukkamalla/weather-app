import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

export default function WeatherChart({ list }) {
  const labels = list.map(item =>
    new Date(item.dt * 1000).toLocaleString("en-IN", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  );
  const temps = list.map(item => item.main.temp);

  const data = {
    labels,
    datasets: [
      {
        label: "3-Hour Forecast (°C)",
        data: temps,
        borderColor: "deepskyblue",
        fill: false,
      },
    ],
  };

  return <Line data={data} />;
}
