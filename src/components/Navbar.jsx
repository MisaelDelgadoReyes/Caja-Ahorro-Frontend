import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { usuario, logout } = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <Link className="navbar-brand d-flex align-items-center" to="/dashboard">
                    <span className="fs-4 me-2">🏦</span> {/* Emoji de ejemplo como Logo */}
                    <span>Sistema Caja Ahorro</span>
                </Link>
                <div className="d-flex align-items-center text-white">
                    <span className="me-3">{usuario?.nombre || 'Usuario'}</span>
                    <button className="btn btn-outline-light btn-sm" onClick={logout}>
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
