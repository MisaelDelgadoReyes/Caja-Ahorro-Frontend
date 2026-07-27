import api from '../api/axios';

export const login = async (credentials) => {
    // Spring Security formLogin espera username y password como url-encoded
    const params = new URLSearchParams();
    params.append('username', credentials.usuario);
    params.append('password', credentials.password);

    try {
        // withCredentials permite al navegador guardar la cookie JSESSIONID
        await api.post('/login', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            withCredentials: true 
        });

        // Si la petición es exitosa, Spring ha creado una sesión. 
        // Retornamos los datos que espera el contexto de React.
        return { data: { token: 'session-cookie', usuario: { id: 1, nombre: credentials.usuario } } };
    } catch (error) {
        throw new Error('Credenciales incorrectas');
    }
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
