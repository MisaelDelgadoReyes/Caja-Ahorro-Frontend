import api from '../api/axios';

export const login = async (credentials) => {
    const usuario = credentials.usuario.trim();
    const password = credentials.password.trim();

    if (!usuario || !password) {
        throw new Error('Ingrese el usuario y la contraseña.');
    }

    const params = new URLSearchParams();

    params.append('username', usuario);
    params.append('password', password);

    try {
        const response = await api.post(
            '/login',
            params,
            {
                headers: {
                    'Content-Type':
                        'application/x-www-form-urlencoded',
                },
                withCredentials: true,
            }
        );

        return {
            data: {
                token: 'session-cookie',
                usuario: {
                    id: 1,
                    nombre: usuario,
                },
                respuesta: response.data,
            },
        };
    } catch (error) {
        const mensajeBackend =
            error.response?.data?.mensaje ||
            error.response?.data?.message;

        if (!error.response) {
            throw new Error(
                'No se pudo conectar con el backend. Verifique que esté encendido en el puerto 8080.'
            );
        }

        if (error.response.status === 401) {
            throw new Error(
                mensajeBackend ||
                'Usuario o contraseña incorrectos.'
            );
        }

        throw new Error(
            mensajeBackend ||
            'No se pudo iniciar sesión.'
        );
    }
};

export const logout = async () => {
    try {
        await api.post(
            '/logout',
            null,
            {
                withCredentials: true,
            }
        );
    } catch (error) {
        console.error(
            'No se pudo cerrar la sesión en el servidor.',
            error
        );
    }
};

export const getUser = () => {
    return null;
};

export const refreshToken = () => {
    return null;
};