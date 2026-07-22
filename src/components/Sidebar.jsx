import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className="bg-light border-end" style={{ width: '250px', minHeight: 'calc(100vh - 56px)' }}>
            <div className="list-group list-group-flush mt-3">
                <Link 
                    to="/dashboard" 
                    className={`list-group-item list-group-item-action bg-light ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                    Dashboard
                </Link>
                <Link 
                    to="/socios" 
                    className={`list-group-item list-group-item-action bg-light ${location.pathname.startsWith('/socios') ? 'active' : ''}`}
                >
                    Socios
                </Link>
                <Link 
                    to="/cuentas" 
                    className={`list-group-item list-group-item-action bg-light ${location.pathname.startsWith('/cuentas') ? 'active' : ''}`}
                >
                    Cuentas
                </Link>
                <Link 
                    to="/ahorros" 
                    className={`list-group-item list-group-item-action bg-light ${location.pathname.startsWith('/ahorros') ? 'active' : ''}`}
                >
                    Ahorros
                </Link>
                <Link 
                    to="/transacciones" 
                    className={`list-group-item list-group-item-action bg-light ${location.pathname.startsWith('/transacciones') ? 'active' : ''}`}
                >
                    Transacciones
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
