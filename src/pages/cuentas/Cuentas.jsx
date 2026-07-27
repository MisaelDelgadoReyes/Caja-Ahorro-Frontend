import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const extraerLista = (response) => {
    return Array.isArray(response.data?.data)
        ? response.data.data
        : [];
};

const obtenerMensajeError = (error, mensajePredeterminado) => {
    const errorBackend = error.response?.data?.errors?.[0];

    return (
        errorBackend?.campo ||
        errorBackend?.mensaje ||
        mensajePredeterminado
    );
};

const formatearFecha = (fecha) => {
    if (!fecha) {
        return 'No registrada';
    }

    const partes = fecha.split('-');

    if (partes.length !== 3) {
        return fecha;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

const formatearDinero = (valor) => {
    const numero = Number(valor ?? 0);

    return numero.toLocaleString('es-EC', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    });
};

const Cuentas = () => {
    const [cuentas, setCuentas] = useState([]);

    const [tipoBusqueda, setTipoBusqueda] = useState('cedula');
    const [valorBusqueda, setValorBusqueda] = useState('');

    const [cargando, setCargando] = useState(true);
    const [buscando, setBuscando] = useState(false);

    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const limpiarMensajes = () => {
        setError('');
        setMensaje('');
    };

    const cargarCuentas = async () => {
        setCargando(true);
        limpiarMensajes();

        try {
            const response = await api.get(
                '/api/v1/cuentas/consultar'
            );

            const listaCuentas = extraerLista(response);

            setCuentas(listaCuentas);

            if (listaCuentas.length === 0) {
                setMensaje('No existen cuentas registradas.');
            }
        } catch (errorPeticion) {
            setCuentas([]);

            setError(
                obtenerMensajeError(
                    errorPeticion,
                    'No se pudo obtener la lista de cuentas.'
                )
            );
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarCuentas();
    }, []);

    const manejarCambioTipoBusqueda = (event) => {
        setTipoBusqueda(event.target.value);
        setValorBusqueda('');
        limpiarMensajes();
    };

    const manejarCambioValorBusqueda = (event) => {
        let valor = event.target.value;

        if (tipoBusqueda === 'cedula') {
            valor = valor.replace(/\D/g, '').slice(0, 10);
        }

        if (tipoBusqueda === 'id') {
            valor = valor.replace(/\D/g, '');
        }

        setValorBusqueda(valor);
        limpiarMensajes();
    };

    const obtenerRutaBusqueda = () => {
        const valorLimpio = valorBusqueda.trim();

        switch (tipoBusqueda) {
            case 'cedula':
                return `/api/v1/cuentas/socio/${valorLimpio}`;

            case 'numero':
                return `/api/v1/cuentas/numero/${encodeURIComponent(
                    valorLimpio
                )}`;

            case 'id':
                return `/api/v1/cuentas/${valorLimpio}`;

            default:
                return '';
        }
    };

    const validarBusqueda = () => {
        const valorLimpio = valorBusqueda.trim();

        if (!valorLimpio) {
            return 'Ingrese un valor para realizar la búsqueda.';
        }

        if (
            tipoBusqueda === 'cedula' &&
            !/^\d{10}$/.test(valorLimpio)
        ) {
            return 'La cédula debe contener exactamente 10 dígitos.';
        }

        if (
            tipoBusqueda === 'id' &&
            !/^\d+$/.test(valorLimpio)
        ) {
            return 'El ID de cuenta debe ser numérico.';
        }

        return '';
    };

    const buscarCuentas = async (event) => {
        event.preventDefault();

        const errorValidacion = validarBusqueda();

        if (errorValidacion) {
            setError(errorValidacion);
            setMensaje('');
            return;
        }

        setBuscando(true);
        limpiarMensajes();

        try {
            const response = await api.get(
                obtenerRutaBusqueda()
            );

            const cuentasEncontradas = extraerLista(response);

            if (cuentasEncontradas.length === 0) {
                setCuentas([]);
                setMensaje(
                    'No se encontraron cuentas con los datos ingresados.'
                );
                return;
            }

            setCuentas(cuentasEncontradas);
        } catch (errorPeticion) {
            setCuentas([]);

            setError(
                obtenerMensajeError(
                    errorPeticion,
                    'No se pudo realizar la búsqueda de cuentas.'
                )
            );
        } finally {
            setBuscando(false);
        }
    };

    const limpiarBusqueda = async () => {
        setValorBusqueda('');
        setTipoBusqueda('cedula');

        await cargarCuentas();
    };

    const obtenerPlaceholder = () => {
        switch (tipoBusqueda) {
            case 'cedula':
                return 'Ingrese 10 dígitos';

            case 'numero':
                return 'Ingrese el número de cuenta';

            case 'id':
                return 'Ingrese el ID de cuenta';

            default:
                return '';
        }
    };

    return (
        <div>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="mb-1">
                        Gestión de Cuentas
                    </h2>

                    <p className="text-muted mb-0">
                        Consulta las cuentas registradas en la caja de
                        ahorro.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={cargarCuentas}
                    disabled={cargando || buscando}
                >
                    Actualizar listado
                </button>
            </div>

            <div className="card shadow-sm mb-4">
                <div className="card-header bg-white">
                    <strong>Buscar cuentas</strong>
                </div>

                <div className="card-body">
                    <form
                        className="row g-3 align-items-end"
                        onSubmit={buscarCuentas}
                    >
                        <div className="col-md-4">
                            <label
                                htmlFor="tipoBusqueda"
                                className="form-label"
                            >
                                Buscar por
                            </label>

                            <select
                                id="tipoBusqueda"
                                className="form-select"
                                value={tipoBusqueda}
                                onChange={manejarCambioTipoBusqueda}
                                disabled={buscando || cargando}
                            >
                                <option value="cedula">
                                    Cédula del socio
                                </option>

                                <option value="numero">
                                    Número de cuenta
                                </option>

                                <option value="id">
                                    ID de cuenta
                                </option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label
                                htmlFor="valorBusqueda"
                                className="form-label"
                            >
                                Valor
                            </label>

                            <input
                                id="valorBusqueda"
                                type="text"
                                inputMode={
                                    tipoBusqueda === 'numero'
                                        ? 'text'
                                        : 'numeric'
                                }
                                className="form-control"
                                value={valorBusqueda}
                                onChange={manejarCambioValorBusqueda}
                                placeholder={obtenerPlaceholder()}
                                maxLength={
                                    tipoBusqueda === 'cedula'
                                        ? 10
                                        : 50
                                }
                                autoComplete="off"
                                disabled={buscando || cargando}
                            />
                        </div>

                        <div className="col-md-2">
                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={buscando || cargando}
                            >
                                {buscando ? 'Buscando...' : 'Buscar'}
                            </button>
                        </div>

                        <div className="col-md-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
                                onClick={limpiarBusqueda}
                                disabled={buscando || cargando}
                            >
                                Limpiar
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {error && (
                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {error}
                </div>
            )}

            {mensaje && !error && (
                <div
                    className="alert alert-info"
                    role="alert"
                >
                    {mensaje}
                </div>
            )}

            <div className="card shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <strong>Cuentas registradas</strong>

                    <span className="badge text-bg-primary">
                        {cuentas.length}
                    </span>
                </div>

                <div className="card-body p-0">
                    {cargando ? (
                        <div className="text-center py-5">
                            <div
                                className="spinner-border text-primary"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Cargando...
                                </span>
                            </div>

                            <p className="text-muted mt-3 mb-0">
                                Cargando cuentas...
                            </p>
                        </div>
                    ) : cuentas.length === 0 ? (
                        <div className="text-center py-5 px-3">
                            <h5 className="mb-2">
                                No hay cuentas para mostrar
                            </h5>

                            <p className="text-muted mb-0">
                                Registra una cuenta o realiza otra
                                búsqueda.
                            </p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Número de cuenta</th>
                                        <th>Tipo</th>
                                        <th>Saldo</th>
                                        <th>Fecha de apertura</th>
                                        <th>Estado</th>
                                        <th>Socio</th>
                                        <th>Cédula</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {cuentas.map((cuenta) => (
                                        <tr key={cuenta.idCuenta}>
                                            <td>
                                                {cuenta.idCuenta}
                                            </td>

                                            <td>
                                                <span className="fw-semibold">
                                                    {cuenta.numeroCuenta}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${
                                                        cuenta.tipoCuenta ===
                                                        'AHORRO'
                                                            ? 'text-bg-primary'
                                                            : 'text-bg-info'
                                                    }`}
                                                >
                                                    {cuenta.tipoCuenta}
                                                </span>
                                            </td>

                                            <td className="fw-semibold">
                                                {formatearDinero(
                                                    cuenta.saldo
                                                )}
                                            </td>

                                            <td>
                                                {formatearFecha(
                                                    cuenta.fechaApertura
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${
                                                        cuenta.activa
                                                            ? 'text-bg-success'
                                                            : 'text-bg-secondary'
                                                    }`}
                                                >
                                                    {cuenta.activa
                                                        ? 'Activa'
                                                        : 'Inactiva'}
                                                </span>
                                            </td>

                                            <td>
                                                {cuenta.socio
                                                    ? `${cuenta.socio.nombres} ${cuenta.socio.apellidos}`
                                                    : 'No disponible'}
                                            </td>

                                            <td>
                                                {cuenta.socio?.cedula ||
                                                    'No disponible'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cuentas;