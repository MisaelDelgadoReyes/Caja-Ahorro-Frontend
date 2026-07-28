import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const DashboardPieChart = () => {

    const data = {
        labels: [
            "Socios",
            "Cuentas",
            "Ahorros",
            "Transacciones"
        ],
        datasets: [
            {
                data: [25, 35, 20, 20],
                backgroundColor: [
                    "#0d6efd",
                    "#198754",
                    "#ffc107",
                    "#dc3545"
                ]
            }
        ]
    };

    return (

        <div className="card shadow border-0">

            <div className="card-body">

                <h5 className="mb-3">
                    Distribución del Sistema
                </h5>

                <Pie data={data} />

            </div>

        </div>

    );

};

export default DashboardPieChart;