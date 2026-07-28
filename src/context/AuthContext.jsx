import { createContext, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const isAuthenticated = !!token;

    const login = (userData, userToken) => {
        setUsuario(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
    };

    const logout = () => {
        setUsuario(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ usuario, token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
