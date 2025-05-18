import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

export default function WeatherChart({ daily }) {
  const labels = daily.map(day =>
    new Date(day.dt * 1000).toLocaleDateString()
  );
  const temps = daily.map(day => day.temp.day);

  const data = {
    labels,
    datasets: [
      {
        label: 'Daily Temperature (°C)',
        data: temps,
        borderColor: 'blue',
        fill: false,
      },
    ],
  };

  return <Line data={data} />;
}
