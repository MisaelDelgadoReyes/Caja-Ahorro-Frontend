import React from "react";

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
        <div className="container-fluid">

            <h2 className="fw-bold mb-4">
                Reportes del Sistema
            </h2>

            <div className="row">

                {reportes.map((reporte, index) => (

                    <div className="col-md-6 mb-4" key={index}>

                        <div className="card shadow border-0 h-100">

                            <div className="card-body">

                                <h4>{reporte.titulo}</h4>

                                <p className="text-muted">
                                    {reporte.descripcion}
                                </p>

                                <button className="btn btn-primary">
                                    Generar Reporte
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default Reportes;