
const FinancialSummary = () => {

    const indicadores = [
        {
            titulo: "Depósitos",
            valor: "$12,500.00",
            color: "success"
        },
        {
            titulo: "Retiros",
            valor: "$3,200.00",
            color: "danger"
        },
        {
            titulo: "Balance",
            valor: "$9,300.00",
            color: "primary"
        },
        {
            titulo: "Créditos",
            valor: "15",
            color: "warning"
        }
    ];

    return (

        <div className="card shadow border-0 mt-4">

            <div className="card-body">

                <h5 className="mb-4">
                    Indicadores Financieros
                </h5>

                <div className="row">

                    {indicadores.map((item, index) => (

                        <div
                            className="col-md-3 text-center"
                            key={index}
                        >

                            <h3 className={`text-${item.color}`}>
                                {item.valor}
                            </h3>

                            <p className="text-muted">
                                {item.titulo}
                            </p>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );

};

export default FinancialSummary;