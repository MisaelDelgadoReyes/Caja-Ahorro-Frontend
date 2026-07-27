import React from "react";

const QuickAccess = () => {

    const opciones = [
        "Socios",
        "Cuentas",
        "Ahorros",
        "Transacciones"
    ];

    return (
        <div className="card shadow border-0 mt-4">
            <div className="card-body">

                <h5 className="mb-4">
                    Accesos rápidos
                </h5>

                <div className="d-flex flex-wrap gap-2">

                    {opciones.map((opcion, index) => (

                        <button
                            key={index}
                            className="btn btn-outline-primary"
                        >
                            {opcion}
                        </button>

                    ))}

                </div>

            </div>
        </div>
    );
};

export default QuickAccess;