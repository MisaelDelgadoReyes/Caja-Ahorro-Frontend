import React from 'react';

const Dashboard = () => {
    return (
        <div>
            <h2>Bienvenido al sistema</h2>
            <hr />
            <div className="row mt-4">
                <div className="col-md-3 mb-3">
                    <div className="card text-white bg-primary shadow h-100">
                        <div className="card-body">
                            <h5 className="card-title">Total socios</h5>
                            <p className="card-text fs-2">0</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card text-white bg-success shadow h-100">
                        <div className="card-body">
                            <h5 className="card-title">Total cuentas</h5>
                            <p className="card-text fs-2">0</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card text-white bg-warning shadow h-100">
                        <div className="card-body">
                            <h5 className="card-title">Total ahorros</h5>
                            <p className="card-text fs-2">$0.00</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card text-white bg-danger shadow h-100">
                        <div className="card-body">
                            <h5 className="card-title">Total transacciones</h5>
                            <p className="card-text fs-2">0</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-muted mt-3">Luego el integrante 4 lo mejora.</p>
        </div>
    );
};

export default Dashboard;
