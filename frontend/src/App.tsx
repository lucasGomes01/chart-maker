import './App.css';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import type { ChartOptions, ChartData } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Meu Gráfico de Barras em TypeScript',
    },
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

const labels: string[] = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'];

export const data: ChartData<'bar'> = {
  labels,
  datasets: [
    {
    label: 'Camiseta A',
    data: [1500, 1800, 1700, 1600, 1750, 1900, 2100, 2000, 1950, 2200, 2300, 2500],
    backgroundColor: 'rgba(255, 99, 132, 0.5)',
    borderColor: 'rgb(255, 99, 132)',
    borderWidth: 1,
    },
    {
    label: 'Calça B',
    data: [2000, 2100, 1900, 1950, 2050, 2200, 2300, 2250, 2150, 2400, 2500, 2600],
    backgroundColor: 'rgba(54, 162, 235, 0.5)',
    borderColor: 'rgb(54, 162, 235)',
    borderWidth: 1,
    },
    {
    label: 'Tênis C',
    data: [3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000, 4100],
    backgroundColor: 'rgba(75, 192, 192, 0.5)',
    borderColor: 'rgb(75, 192, 192)',
    borderWidth: 1,
    },
    {
    label: 'Mochila D',
    data: [1200, 1300, 1100, 1150, 1250, 1350, 1450, 1500, 1600, 1700, 1800, 1900],
    backgroundColor: 'rgba(255, 206, 86, 0.5)',
    borderColor: 'rgb(255, 206, 86)',
    borderWidth: 1,
    }
  ],
};

function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <div  style={{ width: '800px', height: '500px' }}>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}

export default App;