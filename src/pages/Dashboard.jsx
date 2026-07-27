import React from "react";

import DashboardCards from "../components/dashboard/DashboardCards";
import DashboardChart from "../components/dashboard/DashboardChart";
import DashboardPieChart from "../components/dashboard/DashboardPieChart";
import FinancialSummary from "../components/dashboard/FinancialSummary";
import RecentActivity from "../components/dashboard/RecentActivity";
import QuickAccess from "../components/dashboard/QuickAccess";

const Dashboard = () => {
    return (
        <div className="container-fluid">

            <div className="mb-4">
                <h2 className="fw-bold">Dashboard</h2>
                <p className="text-muted">
                    Bienvenido al Sistema de Caja de Ahorro
                </p>
            </div>

            <DashboardCards />

            <div className="row mt-4">

                <div className="col-lg-8">
                    <DashboardChart />
                </div>

                <div className="col-lg-4">
                    <DashboardPieChart />
                </div>

            </div>

            <div className="row mt-4">

                <div className="col-lg-6">
                    <RecentActivity />
                </div>

                <div className="col-lg-6">
                    <QuickAccess />
                </div>

            </div>
            
            <FinancialSummary />

        </div>
    );
};

export default Dashboard;