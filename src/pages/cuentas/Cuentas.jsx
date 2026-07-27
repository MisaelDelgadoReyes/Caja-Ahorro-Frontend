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
    const [socioEncontrado, setSocioEncontrado] = useState(null);

    const [tipoBusqueda, setTipoBusqueda] = useState('cedula');
    const [valorBusqueda, setValorBusqueda] = useState('');

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
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
            const response = await api.get(
                '/api/v1/cuentas/consultar'
            );

            const listaCuentas = extraerLista(response);

            setCuentas(listaCuentas);
            setSocioEncontrado(null);
            setMostrarFormulario(false);

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
        setMostrarFormulario(false);
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
        setMostrarFormulario(false);
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
            setExito('');
            return;
        }

        setBuscando(true);
        limpiarMensajes();
        setSocioEncontrado(null);
        setMostrarFormulario(false);

        try {
            const valorLimpio = valorBusqueda.trim();

            if (tipoBusqueda === 'cedula') {
                const responseSocio = await api.get(
                    `/api/v1/socios/cedula/${valorLimpio}`
                );

                const sociosEncontrados = extraerLista(responseSocio);

                if (sociosEncontrados.length === 0) {
                    setCuentas([]);
                    setMensaje(
                        'No existe ningún socio con la cédula ingresada.'
                    );
                    return;
                }

                const socio = sociosEncontrados[0];

                setSocioEncontrado(socio);

                const responseCuentas = await api.get(
                    `/api/v1/cuentas/socio/${valorLimpio}`
                );

                const cuentasEncontradas = extraerLista(
                    responseCuentas
                );

                setCuentas(cuentasEncontradas);

                if (cuentasEncontradas.length === 0) {
                    setMensaje(
                        `El socio ${socio.nombres} ${socio.apellidos} existe, pero todavía no tiene cuentas registradas.`
                    );
                }

                return;
            }

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
        setMostrarFormulario(false);
        setTipoCuenta('AHORRO');

        await cargarCuentas();
    };

    const abrirFormulario = () => {
        if (!socioEncontrado) {
            setError(
                'Primero debe buscar y seleccionar un socio.'
            );
            return;
        }

        if (!socioEncontrado.activo) {
            setError(
                'No se puede crear una cuenta para un socio inactivo.'
            );
            return;
        }

        setTipoCuenta('AHORRO');
        setMostrarFormulario(true);
        limpiarMensajes();
    };

    const cerrarFormulario = () => {
        setMostrarFormulario(false);
        setTipoCuenta('AHORRO');
        limpiarMensajes();
    };

    const crearCuenta = async (event) => {
        event.preventDefault();

        if (!socioEncontrado) {
            setError(
                'No existe un socio seleccionado para crear la cuenta.'
            );
            return;
        }

        if (
            tipoCuenta !== 'AHORRO' &&
            tipoCuenta !== 'CORRIENTE'
        ) {
            setError('Seleccione un tipo de cuenta válido.');
            return;
        }

        setGuardando(true);
        limpiarMensajes();

        const datosCuenta = {
            cedulaSocio: socioEncontrado.cedula,
            tipoCuenta,
        };

        try {
            await api.post(
                '/api/v1/cuentas/crear',
                datosCuenta
            );

            const responseCuentas = await api.get(
                `/api/v1/cuentas/socio/${socioEncontrado.cedula}`
            );

            const cuentasActualizadas = extraerLista(
                responseCuentas
            );

            setCuentas(cuentasActualizadas);
            setMostrarFormulario(false);
            setTipoCuenta('AHORRO');
            setExito('La cuenta fue creada correctamente.');
        } catch (errorPeticion) {
            setError(
                obtenerMensajeError(
                    errorPeticion,
                    'No se pudo crear la cuenta.'
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
        <div>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="mb-1">
                        Gestión de Cuentas
                    </h2>

                    <p className="text-muted mb-0">
                        Consulta y registra cuentas para los socios.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={cargarCuentas}
                    disabled={cargando || buscando || guardando}
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
                                disabled={
                                    buscando ||
                                    cargando ||
                                    guardando
                                }
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
                                disabled={
                                    buscando ||
                                    cargando ||
                                    guardando
                                }
                            />
                        </div>

                        <div className="col-md-2">
                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={
                                    buscando ||
                                    cargando ||
                                    guardando
                                }
                            >
                                {buscando
                                    ? 'Buscando...'
                                    : 'Buscar'}
                            </button>
                        </div>

                        <div className="col-md-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
                                onClick={limpiarBusqueda}
                                disabled={
                                    buscando ||
                                    cargando ||
                                    guardando
                                }
                            >
                                Limpiar
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {exito && (
                <div className="alert alert-success" role="alert">
                    {exito}
                </div>
            )}

            {mensaje && !error && !exito && (
                <div className="alert alert-info" role="alert">
                    {mensaje}
                </div>
            )}

            {socioEncontrado && (
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
                        <strong>Información del socio</strong>

                        <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={abrirFormulario}
                            disabled={
                                guardando ||
                                !socioEncontrado.activo
                            }
                        >
                            Nueva cuenta
                        </button>
                    </div>

                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <span className="text-muted d-block">
                                    Nombre completo
                                </span>

                                <strong>
                                    {socioEncontrado.nombres}{' '}
                                    {socioEncontrado.apellidos}
                                </strong>
                            </div>

                            <div className="col-md-2">
                                <span className="text-muted d-block">
                                    Cédula
                                </span>

                                <strong>
                                    {socioEncontrado.cedula}
                                </strong>
                            </div>

                            <div className="col-md-3">
                                <span className="text-muted d-block">
                                    Correo
                                </span>

                                <strong>
                                    {socioEncontrado.correo ||
                                        'No registrado'}
                                </strong>
                            </div>

                            <div className="col-md-2">
                                <span className="text-muted d-block">
                                    Teléfono
                                </span>

                                <strong>
                                    {socioEncontrado.telefono ||
                                        'No registrado'}
                                </strong>
                            </div>

                            <div className="col-md-1">
                                <span className="text-muted d-block">
                                    Estado
                                </span>

                                <span
                                    className={`badge ${
                                        socioEncontrado.activo
                                            ? 'text-bg-success'
                                            : 'text-bg-secondary'
                                    }`}
                                >
                                    {socioEncontrado.activo
                                        ? 'Activo'
                                        : 'Inactivo'}
                                </span>
                            </div>

                            <div className="col-12">
                                <span className="text-muted d-block">
                                    Dirección
                                </span>

                                <strong>
                                    {socioEncontrado.direccion ||
                                        'No registrada'}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {mostrarFormulario && socioEncontrado && (
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                        <strong>Crear nueva cuenta</strong>

                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Cerrar"
                            onClick={cerrarFormulario}
                            disabled={guardando}
                        />
                    </div>

                    <div className="card-body">
                        <form
                            className="row g-3 align-items-end"
                            onSubmit={crearCuenta}
                        >
                            <div className="col-md-5">
                                <label className="form-label">
                                    Socio
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={`${socioEncontrado.nombres} ${socioEncontrado.apellidos}`}
                                    disabled
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">
                                    Cédula
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={socioEncontrado.cedula}
                                    disabled
                                />
                            </div>

                            <div className="col-md-4">
                                <label
                                    htmlFor="tipoCuenta"
                                    className="form-label"
                                >
                                    Tipo de cuenta
                                </label>

                                <select
                                    id="tipoCuenta"
                                    className="form-select"
                                    value={tipoCuenta}
                                    onChange={(event) =>
                                        setTipoCuenta(
                                            event.target.value
                                        )
                                    }
                                    disabled={guardando}
                                >
                                    <option value="AHORRO">
                                        Ahorro
                                    </option>

                                    <option value="CORRIENTE">
                                        Corriente
                                    </option>
                                </select>
                            </div>

                            <div className="col-12">
                                <div className="alert alert-light border mb-0">
                                    El número de cuenta, saldo inicial,
                                    fecha de apertura y estado serán
                                    generados automáticamente por el
                                    sistema.
                                </div>
                            </div>

                            <div className="col-12 d-flex justify-content-end gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={cerrarFormulario}
                                    disabled={guardando}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={guardando}
                                >
                                    {guardando
                                        ? 'Creando cuenta...'
                                        : 'Crear cuenta'}
                                </button>
                            </div>
                        </form>
                    </div>
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
                                Busca un socio y crea una nueva cuenta.
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
                                            <td>{cuenta.idCuenta}</td>

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