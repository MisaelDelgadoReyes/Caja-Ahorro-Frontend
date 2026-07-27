# Sistema Caja Ahorro - Frontend

Proyecto frontend para la gestión de la caja de ahorro. Construido con React, Vite, React Router, Bootstrap y Axios.

## Requisitos previos

- Node.js y npm instalados en el sistema.
- Backend en ejecución en `localhost:8080`.

## Instalación

1. Clona el repositorio o abre la carpeta del proyecto.
2. Abre una terminal y navega hasta la carpeta del frontend (`caja-ahorro-frontend`).
3. Instala las dependencias ejecutando:

```bash
npm install
```

## Ejecución

Para iniciar el servidor de desarrollo, ejecuta:

```bash
npm run dev
```

El proyecto estará disponible (generalmente en `http://localhost:5173`).

## Estructura del proyecto

- `src/api/`: Configuración de Axios (`axios.js`). **Si el backend cambia de puerto, modificar solo este archivo**.
- `src/components/`: Componentes reutilizables (`Navbar.jsx`, `Sidebar.jsx`, `Layout.jsx`).
- `src/context/`: Contextos globales (`AuthContext.jsx` para autenticación).
- `src/pages/`: Vistas de la aplicación.
  - `Dashboard.jsx`: Panel principal.
  - `Login.jsx`: Pantalla de inicio de sesión.
  - Subcarpetas para cada módulo (socios, cuentas, ahorros, transacciones) para que cada desarrollador trabaje de forma independiente.
- `src/routes/`: Configuración de react-router (`AppRouter.jsx`, `PrivateRoute.jsx`).
- `src/services/`: Servicios para la comunicación con APIs (`authService.js`).

## Librerías principales utilizadas

- **React Router DOM**: Para la navegación y rutas privadas.
- **Bootstrap**: Para el diseño y responsive.
- **Axios**: Para peticiones HTTP.
