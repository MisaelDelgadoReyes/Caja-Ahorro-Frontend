import { Link } from "react-router-dom";

const QuickAccess = () => {
    const opciones = [
        { name: "Socios", path: "/socios", icon: "👥", desc: "Gestionar miembros" },
        { name: "Cuentas", path: "/cuentas", icon: "💳", desc: "Apertura de cuentas" },
        { name: "Ahorros", path: "/ahorros", icon: "💰", desc: "Consultar ahorros" },
        { name: "Transacciones", path: "/transacciones", icon: "🔄", desc: "Registrar movimientos" },
        { name: "Reportes", path: "/reportes", icon: "📄", desc: "Generar informes" }
    ];

    return (
        <div className="saas-card border-0 mb-4 p-4">
            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center">
                <span className="me-2 text-primary">⚡</span> Accesos Rápidos
            </h5>
            
            <div className="row g-3">
                {opciones.map((opcion, index) => (
                    <div className="col-md-4 col-sm-6 col-12" key={index}>
                        <Link to={opcion.path} className="text-decoration-none">
                            <div className="card h-100 border-0 bg-light hover-bg-white" style={{ transition: 'all 0.2s ease', cursor: 'pointer' }}>
                                <div className="card-body d-flex align-items-center p-3">
                                    <div className="rounded d-flex justify-content-center align-items-center me-3 bg-white shadow-sm" style={{ width: '48px', height: '48px', fontSize: '20px' }}>
                                        {opcion.icon}
                                    </div>
                                    <div>
                                        <h6 className="fw-semibold text-dark mb-0">{opcion.name}</h6>
                                        <small className="text-muted">{opcion.desc}</small>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuickAccess;