import api from '../api/axios';

export const login = async (credentials) => {
    // Ejemplo de llamada: return api.post('/login', credentials);
    // Como no sabemos la ruta exacta, retornamos un mock por ahora
    return new Promise((resolve) => {
        setTimeout(() => resolve({ data: { token: 'mock-token-123', usuario: { id: 1, nombre: 'Admin' } } }), 1000);
    });
};

export const logout = () => {
    // Implementar limpieza si el backend la requiere
};

export const getUser = () => {
    // Implementar obtención del usuario actual
};

export const refreshToken = () => {
    // Implementar lógica para refrescar token
};
