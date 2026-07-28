import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login as loginService } from '../services/authService';

const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await loginService({ usuario, password });
            // Asumiendo que el backend retorna { data: { token, usuario: {...} } }
            login(response.data.usuario, response.data.token);
            navigate('/dashboard');
        } catch {
            setError('Credenciales incorrectas o error en el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: 'var(--bg-body)' }}>
            <div className="saas-card p-5" style={{ width: '100%', maxWidth: '420px', borderRadius: '16px' }}>
                <div className="text-center mb-5">
                    <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '12px', fontSize: '20px', fontWeight: 'bold' }}>
                        CA
                    </div>
                    <h3 className="fw-bold text-dark mb-1">Bienvenido de nuevo</h3>
                    <p className="text-muted" style={{ fontSize: '14px' }}>Inicia sesión en tu cuenta para continuar</p>
                </div>
                
                {error && (
                    <div className="alert alert-danger d-flex align-items-center mb-4 p-3 border-0 rounded-3" style={{ fontSize: '14px', backgroundColor: '#fee2e2', color: '#991b1b' }}>
                        <span className="me-2">⚠️</span> {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label fw-semibold text-secondary" style={{ fontSize: '13px' }}>Nombre de Usuario</label>
                        <input 
                            type="text" 
                            className="form-control form-control-lg" 
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            placeholder="Ej. admin"
                            required 
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <label className="form-label fw-semibold text-secondary mb-0" style={{ fontSize: '13px' }}>Contraseña</label>
                            <a href="#" className="text-primary text-decoration-none" style={{ fontSize: '13px', fontWeight: '500' }}>¿Olvidaste tu contraseña?</a>
                        </div>
                        <input 
                            type="password" 
                            className="form-control form-control-lg mt-2" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required 
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 btn-lg fw-semibold mt-2" disabled={loading}>
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
