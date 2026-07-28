import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import QuickAccess from "../components/dashboard/QuickAccess";

const Dashboard = () => {
    const { usuario } = useContext(AuthContext);

    return (
        <div className="container-fluid py-2">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1">Visión General</h2>
                    <p className="text-muted mb-0">
                        ¡Hola, {usuario?.nombre || 'Usuario'}! Bienvenido al Sistema de Caja de Ahorro.
                    </p>
                </div>
                <div>
                    <span className="badge bg-primary px-3 py-2" style={{ fontSize: '14px' }}>
                        📅 {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-lg-12">
                    <div className="saas-card p-4 text-center mb-4 border-0 bg-primary bg-opacity-10 text-primary">
                        <div className="mb-3" style={{ fontSize: '40px' }}>🚀</div>
                        <h4 className="fw-bold">Sistema Listo</h4>
                        <p className="mb-0 mx-auto" style={{ maxWidth: '600px', opacity: 0.8 }}>
                            El sistema está operativo. Utiliza el menú lateral o los accesos rápidos a continuación para gestionar socios, cuentas y transacciones.
                        </p>
                    </div>
                </div>
            </div>

            <div className="row mt-2">
                <div className="col-12">
                    <QuickAccess />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;