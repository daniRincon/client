import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Recommender from './components/recommender';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const socket = io('http://localhost:5000');

export default function App() {
  const [ecgData, setEcgData] = useState([]);

  useEffect(() => {
    socket.on('ecg_data', (data) => {
      console.log("data", data);
      setEcgData((prevData) => {
        const newData = [...prevData, parseInt(data)];
        return newData.slice(-100);
      });
    });

    return () => {
      socket.off('ecg_data');
    };
  }, []);

  const chartData = {
    labels: ecgData.map((_, index) => index.toString()),
    datasets: [
      {
        label: 'ECG',
        data: ecgData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Datos del ECG en tiempo real',
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Muestras',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Valor',
        },
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Telemedicina</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <Line data={chartData} options={options} />
        </div>
        <div className="w-full md:w-1/3">
          <Recommender onData={() => ecgData} />
        </div>
      </div>
    </div>
  );
}