import { useEffect, useState } from 'react';
import api from '../../api/axios';

const extraerLista = (response) => {
    return Array.isArray(response.data?.data)
        ? response.data.data
        : [];
};

const obtenerMensajeError = (error, mensajePredeterminado) => {
    const errorBackend = error.response?.data?.errors?.[0];

    return (
        errorBackend?.mensaje ||
        errorBackend?.campo ||
        error.response?.data?.mensaje ||
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

const ordenarCuentas = (listaCuentas) => {
    return [...listaCuentas].sort((cuentaA, cuentaB) => {
        return (
            Number(cuentaB.idCuenta ?? 0) -
            Number(cuentaA.idCuenta ?? 0)
        );
    });
};

const Cuentas = () => {
    const [cuentas, setCuentas] = useState([]);
    const [socioEncontrado, setSocioEncontrado] = useState(null);

    const [tipoBusqueda, setTipoBusqueda] = useState('cedula');
    const [valorBusqueda, setValorBusqueda] = useState('');

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [cedulaRegistro, setCedulaRegistro] = useState('');
    const [tipoCuenta, setTipoCuenta] = useState('AHORRO');

    const [cargando, setCargando] = useState(true);
    const [buscando, setBuscando] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [exito, setExito] = useState('');

    const limpiarMensajes = () => {
        setError('');
        setMensaje('');
        setExito('');
    };

    const cargarCuentas = async () => {
        setCargando(true);
        limpiarMensajes();

        try {
            const response = await api.get('/api/v1/cuentas/consultar');
            const listaCuentas = ordenarCuentas(extraerLista(response));

            setCuentas(listaCuentas);
            setSocioEncontrado(null);

            if (listaCuentas.length === 0) {
                setMensaje('No existen cuentas registradas.');
            }
        } catch (errorPeticion) {
            setCuentas([]);
            setSocioEncontrado(null);
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

    /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
    useEffect(() => {
        cargarCuentas();
    }, []);
    /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

    const manejarCambioTipoBusqueda = (event) => {
        setTipoBusqueda(event.target.value);
        setValorBusqueda('');
        setSocioEncontrado(null);
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
        setSocioEncontrado(null);
        limpiarMensajes();
    };

    const manejarCambioCedulaRegistro = (event) => {
        const cedula = event.target.value
            .replace(/\D/g, '')
            .slice(0, 10);

        setCedulaRegistro(cedula);
        setSocioEncontrado(null);
        limpiarMensajes();
    };

    const obtenerRutaBusqueda = () => {
        const valorLimpio = valorBusqueda.trim();

        switch (tipoBusqueda) {
            case 'cedula':
                return `/api/v1/cuentas/socio/${valorLimpio}`;
            case 'numero':
                return `/api/v1/cuentas/numero/${encodeURIComponent(valorLimpio)}`;
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

        if (tipoBusqueda === 'cedula' && !/^\d{10}$/.test(valorLimpio)) {
            return 'La cédula debe contener exactamente 10 dígitos.';
        }

        if (tipoBusqueda === 'id' && !/^\d+$/.test(valorLimpio)) {
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
            setExito('');
            return;
        }

        setBuscando(true);
        limpiarMensajes();
        setSocioEncontrado(null);

        try {
            const valorLimpio = valorBusqueda.trim();

            if (tipoBusqueda === 'cedula') {
                const responseSocio = await api.get(
                    `/api/v1/socios/cedula/${valorLimpio}`
                );
                const sociosEncontrados = extraerLista(responseSocio);

                if (sociosEncontrados.length === 0) {
                    setCuentas([]);
                    setMensaje('No existe ningún socio con la cédula ingresada.');
                    return;
                }

                const socio = sociosEncontrados[0];
                setSocioEncontrado(socio);

                const responseCuentas = await api.get(
                    `/api/v1/cuentas/socio/${valorLimpio}`
                );
                const cuentasEncontradas = ordenarCuentas(
                    extraerLista(responseCuentas)
                );

                setCuentas(cuentasEncontradas);

                if (cuentasEncontradas.length === 0) {
                    setMensaje(
                        `El socio ${socio.nombres} ${socio.apellidos} existe, pero todavía no tiene cuentas registradas.`
                    );
                }

                return;
            }

            const response = await api.get(obtenerRutaBusqueda());
            const cuentasEncontradas = ordenarCuentas(extraerLista(response));

            if (cuentasEncontradas.length === 0) {
                setCuentas([]);
                setMensaje('No se encontraron cuentas con los datos ingresados.');
                return;
            }

            setCuentas(cuentasEncontradas);

            const socioCuenta = cuentasEncontradas[0]?.socio;
            if (socioCuenta) {
                setSocioEncontrado(socioCuenta);
            }
        } catch (errorPeticion) {
            setCuentas([]);
            setSocioEncontrado(null);
            setError(
                obtenerMensajeError(
                    errorPeticion,
                    'No se pudo realizar la búsqueda.'
                )
            );
        } finally {
            setBuscando(false);
        }
    };

    const limpiarBusqueda = async () => {
        setValorBusqueda('');
        setTipoBusqueda('cedula');
        setSocioEncontrado(null);
        await cargarCuentas();
    };

    const abrirFormulario = () => {
        setCedulaRegistro(socioEncontrado?.cedula ?? '');
        setTipoCuenta('AHORRO');
        setMostrarFormulario(true);
        limpiarMensajes();
    };

    const cerrarFormulario = () => {
        setMostrarFormulario(false);
        setCedulaRegistro('');
        setTipoCuenta('AHORRO');
        limpiarMensajes();
    };

    const crearCuenta = async (event) => {
        event.preventDefault();

        const cedulaLimpia = cedulaRegistro.trim();

        if (!/^\d{10}$/.test(cedulaLimpia)) {
            setError('La cédula del socio debe contener exactamente 10 dígitos.');
            return;
        }

        if (tipoCuenta !== 'AHORRO' && tipoCuenta !== 'CORRIENTE') {
            setError('Seleccione un tipo de cuenta válido.');
            return;
        }

        setGuardando(true);
        limpiarMensajes();

        try {
            const responseSocio = await api.get(
                `/api/v1/socios/cedula/${cedulaLimpia}`
            );
            const sociosEncontrados = extraerLista(responseSocio);

            if (sociosEncontrados.length === 0) {
                setError('No existe ningún socio con la cédula ingresada.');
                return;
            }

            const socio = sociosEncontrados[0];

            if (socio.activo === false) {
                setError('No se puede crear una cuenta para un socio inactivo.');
                return;
            }

            await api.post('/api/v1/cuentas/crear', {
                cedulaSocio: cedulaLimpia,
                tipoCuenta,
            });

            const responseCuentas = await api.get(
                `/api/v1/cuentas/socio/${cedulaLimpia}`
            );
            const cuentasActualizadas = ordenarCuentas(
                extraerLista(responseCuentas)
            );

            setCuentas(cuentasActualizadas);
            setSocioEncontrado(socio);
            setTipoBusqueda('cedula');
            setValorBusqueda(cedulaLimpia);
            setMostrarFormulario(false);
            setCedulaRegistro('');
            setTipoCuenta('AHORRO');
            setExito('La cuenta fue registrada correctamente.');
        } catch (errorPeticion) {
            setError(
                obtenerMensajeError(
                    errorPeticion,
                    'No se pudo registrar la cuenta.'
                )
            );
        } finally {
            setGuardando(false);
        }
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
        <div className="container-fluid py-2">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="mb-1 text-dark fw-bold">Gestión de Cuentas</h2>
                    <p className="text-muted mb-0">
                        Consulta y registra cuentas para los socios.
                    </p>
                </div>

                <div className="d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-secondary d-flex align-items-center gap-2"
                        onClick={cargarCuentas}
                        disabled={cargando || buscando || guardando}
                    >
                        <span>🔄</span> Actualizar
                    </button>

                    <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={abrirFormulario}
                        disabled={guardando}
                    >
                        <span>➕</span> Nueva cuenta
                    </button>
                </div>
            </div>

            {mostrarFormulario && (
                <div className="saas-card mb-4 border-0">
                    <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 fw-bold text-dark">Registrar nueva cuenta</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={cerrarFormulario}
                            disabled={guardando}
                        />
                    </div>

                    <div className="card-body px-4 pb-4">
                        <form className="row g-4 align-items-end" onSubmit={crearCuenta}>
                            <div className="col-md-6">
                                <label htmlFor="cedulaRegistro" className="form-label fw-semibold" style={{ fontSize: '13px' }}>
                                    Cédula del socio
                                </label>
                                <input
                                    id="cedulaRegistro"
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    value={cedulaRegistro}
                                    onChange={manejarCambioCedulaRegistro}
                                    placeholder="Ingrese 10 dígitos"
                                    maxLength={10}
                                    autoComplete="off"
                                    disabled={guardando}
                                    autoFocus
                                />
                                <div className="form-text mt-2">
                                    El socio debe existir antes de registrar la cuenta.
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="tipoCuenta" className="form-label fw-semibold" style={{ fontSize: '13px' }}>
                                    Tipo de cuenta
                                </label>
                                <select
                                    id="tipoCuenta"
                                    className="form-select"
                                    value={tipoCuenta}
                                    onChange={(event) => setTipoCuenta(event.target.value)}
                                    disabled={guardando}
                                >
                                    <option value="AHORRO">Ahorro</option>
                                    <option value="CORRIENTE">Corriente</option>
                                </select>
                            </div>

                            <div className="col-12 mt-4">
                                <div className="alert alert-info border-0 rounded-3 mb-0" style={{ backgroundColor: '#e0f2fe', color: '#075985' }}>
                                    💡 El número de cuenta, saldo inicial y demás datos serán generados automáticamente por el sistema.
                                </div>
                            </div>

                            <div className="col-12 d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary px-4"
                                    onClick={cerrarFormulario}
                                    disabled={guardando}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary px-4"
                                    disabled={guardando}
                                >
                                    {guardando ? 'Registrando...' : 'Registrar cuenta'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="row mb-4">
                <div className="col-lg-8">
                    <div className="saas-card border-0 h-100">
                        <div className="card-body p-4">
                            <h6 className="fw-bold mb-3 text-dark">Buscar cuentas</h6>
                            <form className="row g-3 align-items-end" onSubmit={buscarCuentas}>
                                <div className="col-md-4">
                                    <label htmlFor="tipoBusqueda" className="form-label fw-semibold" style={{ fontSize: '13px' }}>
                                        Buscar por
                                    </label>
                                    <select
                                        id="tipoBusqueda"
                                        className="form-select"
                                        value={tipoBusqueda}
                                        onChange={manejarCambioTipoBusqueda}
                                        disabled={buscando || cargando || guardando}
                                    >
                                        <option value="cedula">Cédula del socio</option>
                                        <option value="numero">Número de cuenta</option>
                                        <option value="id">ID de cuenta</option>
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="valorBusqueda" className="form-label fw-semibold" style={{ fontSize: '13px' }}>
                                        Valor
                                    </label>
                                    <input
                                        id="valorBusqueda"
                                        type="text"
                                        inputMode={tipoBusqueda === 'numero' ? 'text' : 'numeric'}
                                        className="form-control"
                                        value={valorBusqueda}
                                        onChange={manejarCambioValorBusqueda}
                                        placeholder={obtenerPlaceholder()}
                                        maxLength={tipoBusqueda === 'cedula' ? 10 : 50}
                                        autoComplete="off"
                                        disabled={buscando || cargando || guardando}
                                    />
                                </div>

                                <div className="col-md-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={buscando || cargando || guardando}
                                    >
                                        {buscando ? 'Buscando...' : 'Buscar'}
                                    </button>
                                </div>

                                <div className="col-md-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary w-100"
                                        onClick={limpiarBusqueda}
                                        disabled={buscando || cargando || guardando}
                                    >
                                        Limpiar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 mt-3 mt-lg-0">
                    <div className="saas-card border-0 h-100 bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center p-4">
                        <div className="text-center">
                            <h2 className="fw-bold mb-0">{cuentas.length}</h2>
                            <span className="fw-medium">Cuentas Activas</span>
                        </div>
                    </div>
                </div>
            </div>

            {error && <div className="alert alert-danger border-0 rounded-3" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>{error}</div>}
            {exito && <div className="alert alert-success border-0 rounded-3" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>{exito}</div>}
            {mensaje && !error && !exito && (
                <div className="alert alert-info border-0 rounded-3" style={{ backgroundColor: '#e0f2fe', color: '#075985' }}>{mensaje}</div>
            )}

            {socioEncontrado && (
                <div className="saas-card mb-4 border-0 border-start border-primary border-4 rounded-3">
                    <div className="card-header bg-white border-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center">
                        <h6 className="fw-bold text-dark mb-0">Información del socio</h6>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm px-3"
                            onClick={abrirFormulario}
                            disabled={guardando || socioEncontrado.activo === false}
                        >
                            Nueva cuenta
                        </button>
                    </div>
                    <div className="card-body px-4 pb-4">
                        <div className="row g-4">
                            <div className="col-md-4">
                                <span className="text-muted d-block" style={{ fontSize: '13px' }}>Nombre completo</span>
                                <strong className="text-dark">
                                    {socioEncontrado.nombres} {socioEncontrado.apellidos}
                                </strong>
                            </div>
                            <div className="col-md-3">
                                <span className="text-muted d-block" style={{ fontSize: '13px' }}>Cédula</span>
                                <strong className="text-dark">{socioEncontrado.cedula}</strong>
                            </div>
                            <div className="col-md-3">
                                <span className="text-muted d-block" style={{ fontSize: '13px' }}>Correo</span>
                                <strong className="text-dark">{socioEncontrado.correo || 'No registrado'}</strong>
                            </div>
                            <div className="col-md-2">
                                <span className="text-muted d-block mb-1" style={{ fontSize: '13px' }}>Estado</span>
                                <span
                                    className={`badge ${
                                        socioEncontrado.activo === false
                                            ? 'bg-secondary'
                                            : 'bg-success'
                                    }`}
                                >
                                    {socioEncontrado.activo === false ? 'Inactivo' : 'Activo'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="saas-card border-0">
                <div className="card-body p-0">
                    {cargando ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="text-muted mt-3 mb-0">Cargando cuentas...</p>
                        </div>
                    ) : cuentas.length === 0 ? (
                        <div className="text-center py-5 px-3">
                            <div style={{ fontSize: '48px', opacity: 0.5 }}>💳</div>
                            <h5 className="mb-2 mt-3 fw-semibold text-dark">No hay cuentas para mostrar</h5>
                            <p className="text-muted mb-0">
                                Registra una nueva cuenta o realiza otra búsqueda.
                            </p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-4">Cuenta</th>
                                        <th>Socio</th>
                                        <th>Tipo</th>
                                        <th>Saldo</th>
                                        <th>Fecha</th>
                                        <th className="pe-4">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cuentas.map((cuenta) => (
                                        <tr key={cuenta.idCuenta}>
                                            <td className="ps-4">
                                                <div className="fw-semibold text-dark">{cuenta.numeroCuenta}</div>
                                                <div className="text-muted" style={{ fontSize: '12px' }}>ID: {cuenta.idCuenta}</div>
                                            </td>
                                            <td>
                                                <div className="fw-semibold text-dark">
                                                    {cuenta.socio ? `${cuenta.socio.nombres} ${cuenta.socio.apellidos}` : 'No disponible'}
                                                </div>
                                                <div className="text-muted" style={{ fontSize: '12px' }}>
                                                    {cuenta.socio?.cedula || ''}
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        cuenta.tipoCuenta === 'AHORRO'
                                                            ? 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25'
                                                            : 'bg-info bg-opacity-10 text-info border border-info border-opacity-25'
                                                    }`}
                                                >
                                                    {cuenta.tipoCuenta}
                                                </span>
                                            </td>
                                            <td className="fw-bold text-dark">
                                                {formatearDinero(cuenta.saldo)}
                                            </td>
                                            <td>{formatearFecha(cuenta.fechaApertura)}</td>
                                            <td className="pe-4">
                                                <span
                                                    className={`badge ${
                                                        cuenta.activa
                                                            ? 'bg-success'
                                                            : 'bg-secondary'
                                                    }`}
                                                >
                                                    {cuenta.activa ? 'Activa' : 'Inactiva'}
                                                </span>
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