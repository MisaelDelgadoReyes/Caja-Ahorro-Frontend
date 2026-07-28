
const RecentActivity = () => {

    const movimientos = [
        {
            descripcion: "Nuevo socio registrado",
            fecha: "Hoy"
        },
        {
            descripcion: "Cuenta creada",
            fecha: "Hoy"
        },
        {
            descripcion: "Depósito realizado",
            fecha: "Ayer"
        },
        {
            descripcion: "Transferencia registrada",
            fecha: "Ayer"
        }
    ];

    return (
        <div className="card shadow border-0 mt-4">
            <div className="card-body">

                <h5 className="mb-4">
                    Actividad reciente
                </h5>

                <ul className="list-group list-group-flush">

                    {movimientos.map((item, index) => (

                        <li
                            key={index}
                            className="list-group-item d-flex justify-content-between"
                        >
                            <span>{item.descripcion}</span>

                            <small className="text-muted">
                                {item.fecha}
                            </small>
                        </li>

                    ))}

                </ul>

            </div>
        </div>
    );
};

export default RecentActivity;