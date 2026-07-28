import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
    const { usuario, logout } = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top" style={{ zIndex: 1030 }}>
            <div className="container-fluid px-4 py-2">
                <div className="d-flex align-items-center">
                    <button className="btn btn-light d-lg-none me-3" onClick={toggleSidebar}>
                        ☰
                    </button>
                    <Link className="navbar-brand d-flex align-items-center fw-bold" to="/dashboard" style={{ color: 'var(--dark-blue)' }}>
                        <div className="d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '8px', fontSize: '14px' }}>
                            CA
                        </div>
                        <span className="d-none d-sm-inline">Caja de Ahorro</span>
                    </Link>
                </div>
                
                <div className="d-flex align-items-center">
                    <div className="d-none d-md-block me-3 text-end">
                        <div className="fw-semibold" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                            {usuario?.nombre || 'Usuario Administrador'}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {usuario?.rol || 'Administrador'}
                        </div>
                    </div>
                    <button className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-medium" onClick={logout}>
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
