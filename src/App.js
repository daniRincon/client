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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const socket = io('http://localhost:3000');

export default function App() {
  const [ecgData, setEcgData] = useState([]);

  useEffect(() => {
    socket.on('ecg_data', (data) => {
      setEcgData((prevData) => {
        const newData = [...prevData, parseInt(data)];
        return newData.slice(-100); // Mantener solo los últimos 100 puntos
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
    <div className="App">
      <h1>ELECTROCARDIOGRAMA</h1>
      <div style={{ width: '80%', margin: '0 auto' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}