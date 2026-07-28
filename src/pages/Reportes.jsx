
const Reportes = () => {

    const reportes = [
        {
            titulo: "Reporte de Socios",
            descripcion: "Consulta y genera el listado de socios registrados."
        },
        {
            titulo: "Reporte de Cuentas",
            descripcion: "Visualiza todas las cuentas creadas en el sistema."
        },
        {
            titulo: "Reporte de Ahorros",
            descripcion: "Consulta los movimientos y saldos de ahorro."
        },
        {
            titulo: "Reporte de Transacciones",
            descripcion: "Muestra el historial de depósitos y retiros."
        }
    ];

    return (
        <div className="container-fluid py-2">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="mb-1 text-dark fw-bold">Reportes del Sistema</h2>
                    <p className="text-muted mb-0">
                        Genera y descarga informes detallados de la plataforma.
                    </p>
                </div>
            </div>

            <div className="row g-4">
                {reportes.map((reporte, index) => (
                    <div className="col-md-6 mb-4" key={index}>
                        <div className="saas-card border-0 h-100">
                            <div className="card-body p-4 d-flex flex-column">
                                <h5 className="fw-bold text-dark mb-2">{reporte.titulo}</h5>
                                <p className="text-muted flex-grow-1" style={{ fontSize: '14px' }}>
                                    {reporte.descripcion}
                                </p>
                                <div className="mt-4 pt-3 border-top">
                                    <button className="btn btn-primary d-inline-flex align-items-center gap-2">
                                        <span>📊</span> Generar Reporte
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reportes;