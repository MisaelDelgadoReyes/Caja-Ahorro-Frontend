import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Socios from '../pages/socios/Socios';
import Cuentas from '../pages/cuentas/Cuentas';
import Ahorros from '../pages/ahorros/Ahorros';
import Transacciones from '../pages/transacciones/Transacciones';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta Pública */}
                <Route path="/" element={<Login />} />

                {/* Rutas Privadas */}
                <Route element={<PrivateRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/socios" element={<Socios />} />
                        <Route path="/cuentas" element={<Cuentas />} />
                        <Route path="/ahorros" element={<Ahorros />} />
                        <Route path="/transacciones" element={<Transacciones />} />
                        {/* Redirección por defecto si la ruta no coincide */}
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
