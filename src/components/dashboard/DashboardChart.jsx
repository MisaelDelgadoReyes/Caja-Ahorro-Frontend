import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardChart = () => {
  const data = {
    labels: ["Socios", "Cuentas", "Ahorros", "Transacciones"],
    datasets: [
      {
        label: "Resumen General",
        data: [0, 0, 0, 0],
        backgroundColor: [
          "#0d6efd",
          "#198754",
          "#ffc107",
          "#dc3545",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Resumen General del Sistema",
      },
    },
  };

  return (
    <div className="card shadow mt-4">
      <div className="card-body">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default DashboardChart;