import React from "react";

const DashboardCards = () => {

    const cards = [

        {
            title: "Socios",
            value: 0,
            color: "primary",
            icon: "bi-people-fill"
        },

        {
            title: "Cuentas",
            value: 0,
            color: "success",
            icon: "bi-wallet2"
        },

        {
            title: "Ahorros",
            value: "$0.00",
            color: "warning",
            icon: "bi-piggy-bank-fill"
        },

        {
            title: "Transacciones",
            value: 0,
            color: "danger",
            icon: "bi-arrow-left-right"
        }

    ];

    return (

        <div className="row">

            {cards.map((card,index)=>(

                <div
                    className="col-lg-3 col-md-6 mb-4"
                    key={index}
                >

                    <div className={`card shadow border-0 bg-${card.color} text-white h-100`}>

                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <h6 className="text-uppercase">

                                        {card.title}

                                    </h6>

                                    <h2 className="fw-bold">

                                        {card.value}

                                    </h2>

                                </div>

                                <i
                                    className={`bi ${card.icon}`}
                                    style={{fontSize:"3rem"}}
                                ></i>

                            </div>

                        </div>

                    </div>

                </div>

            ))}

        </div>

    );

};

export default DashboardCards;