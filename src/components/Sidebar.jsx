import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/socios', label: 'Socios', icon: '👥' },
        { path: '/cuentas', label: 'Cuentas', icon: '💳' },
        { path: '/ahorros', label: 'Ahorros', icon: '💰' },
        { path: '/transacciones', label: 'Transacciones', icon: '🔄' },
        { path: '/reportes', label: 'Reportes', icon: '📄' },
    ];

    const getLinkClass = (path) => {
        const isActive = location.pathname.startsWith(path);
        return `list-group-item list-group-item-action border-0 mb-1 rounded-3 d-flex align-items-center gap-3 py-2 px-3 fw-medium transition-all ${
            isActive 
                ? 'bg-primary bg-opacity-10 text-primary' 
                : 'text-secondary bg-transparent hover-bg-light'
        }`;
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none" 
                    style={{ zIndex: 1040 }}
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar Container */}
            <div 
                className={`bg-white border-end d-flex flex-column transition-all ${isOpen ? 'position-fixed h-100 shadow' : 'd-none d-lg-flex'}`}
                style={{ 
                    width: '260px', 
                    minHeight: 'calc(100vh - 64px)',
                    zIndex: 1045,
                    left: isOpen ? 0 : '-260px'
                }}
            >
                <div className="p-3 mt-2 flex-grow-1">
                    <div className="text-uppercase fw-bold text-muted mb-3 px-3" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                        Menú Principal
                    </div>
                    <div className="list-group list-group-flush">
                        {navItems.map((item) => (
                            <Link 
                                key={item.path}
                                to={item.path} 
                                className={getLinkClass(item.path)}
                                onClick={() => { if (isOpen) toggleSidebar(); }}
                                style={location.pathname.startsWith(item.path) ? { color: 'var(--primary)' } : {}}
                            >
                                <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
                
                <div className="p-4 border-top">
                    <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-light d-flex justify-content-center align-items-center me-3 text-secondary" style={{ width: '40px', height: '40px' }}>
                            ⚙️
                        </div>
                        <div>
                            <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>Configuración</div>
                            <div className="text-muted" style={{ fontSize: '12px' }}>Ajustes del sistema</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
