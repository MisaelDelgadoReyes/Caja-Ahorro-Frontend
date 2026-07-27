import { useEffect, useState } from 'react';
import api from '../../api/axios';

const FORMULARIO_INICIAL = {
    cedula: '',
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    direccion: '',
};

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

const validarFormulario = (formulario) => {
    const errores = {};

    if (!/^\d{10}$/.test(formulario.cedula)) {
        errores.cedula = 'La cédula debe contener exactamente 10 dígitos.';
    }

    if (!formulario.nombres.trim()) {
        errores.nombres = 'Los nombres son obligatorios.';
    }

    if (!formulario.apellidos.trim()) {
        errores.apellidos = 'Los apellidos son obligatorios.';
    }

    if (!formulario.correo.trim()) {
        errores.correo = 'El correo es obligatorio.';
    } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.correo.trim())
    ) {
        errores.correo = 'Ingrese un correo electrónico válido.';
    }

    if (
        formulario.telefono &&
        !/^\d{7,15}$/.test(formulario.telefono)
    ) {
        errores.telefono =
            'El teléfono debe contener entre 7 y 15 dígitos.';
    }

    if (formulario.direccion.length > 200) {
        errores.direccion =
            'La dirección no puede superar los 200 caracteres.';
    }

    return errores;
};

const Socios = () => {
    const [socios, setSocios] = useState([]);
    const [cedulaBusqueda, setCedulaBusqueda] = useState('');

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
    const [erroresFormulario, setErroresFormulario] = useState({});

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

    const cargarSocios = async () => {
        setCargando(true);
        limpiarMensajes();

        try {
            const response = await api.get('/api/v1/socios/consultar');
            const listaSocios = extraerLista(response);

            setSocios(listaSocios);

            if (listaSocios.length === 0) {
                setMensaje('No existen socios registrados.');
            }
        } catch (errorPeticion) {
            setSocios([]);

            setError(
                obtenerMensajeError(
                    errorPeticion,
                    'No se pudo obtener la lista de socios.'
                )
            );
        } finally {
            setCargando(false);
        }
    };

    /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
    useEffect(() => {
        cargarSocios();
    }, []);
    /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

    const manejarCambioCedulaBusqueda = (event) => {
        const valor = event.target.value
            .replace(/\D/g, '')
            .slice(0, 10);

        setCedulaBusqueda(valor);
        limpiarMensajes();
    };

    const buscarSocio = async (event) => {
        event.preventDefault();

        const cedulaLimpia = cedulaBusqueda.trim();

        if (!cedulaLimpia) {
            setError('Ingrese la cédula del socio.');
            setMensaje('');
            return;
        }

        if (!/^\d{10}$/.test(cedulaLimpia)) {
            setError(
                'La cédula debe contener exactamente 10 dígitos.'
            );
            setMensaje('');
            return;
        }

        setBuscando(true);
        limpiarMensajes();

        try {
            const response = await api.get(
                `/api/v1/socios/cedula/${cedulaLimpia}`
            );

            const sociosEncontrados = extraerLista(response);

            if (sociosEncontrados.length === 0) {
                setSocios([]);
                setMensaje(
                    'No se encontró ningún socio con la cédula ingresada.'
                );
                return;
            }

            setSocios(sociosEncontrados);
        } catch (errorPeticion) {
            setSocios([]);

            setError(
                obtenerMensajeError(
                    errorPeticion,
                    'No se pudo buscar el socio.'
                )
            );
        } finally {
            setBuscando(false);
        }
    };

    const limpiarBusqueda = async () => {
        setCedulaBusqueda('');
        await cargarSocios();
    };

    const abrirFormulario = () => {
        setMostrarFormulario(true);
        setFormulario(FORMULARIO_INICIAL);
        setErroresFormulario({});
        limpiarMensajes();
    };

    const cerrarFormulario = () => {
        setMostrarFormulario(false);
        setFormulario(FORMULARIO_INICIAL);
        setErroresFormulario({});
    };

    const manejarCambioFormulario = (event) => {
        const { name, value } = event.target;

        let nuevoValor = value;

        if (name === 'cedula') {
            nuevoValor = value.replace(/\D/g, '').slice(0, 10);
        }

        if (name === 'telefono') {
            nuevoValor = value.replace(/\D/g, '').slice(0, 15);
        }

        setFormulario((estadoAnterior) => ({
            ...estadoAnterior,
            [name]: nuevoValor,
        }));

        setErroresFormulario((erroresAnteriores) => ({
            ...erroresAnteriores,
            [name]: '',
        }));

        limpiarMensajes();
    };

    const registrarSocio = async (event) => {
        event.preventDefault();

        const errores = validarFormulario(formulario);

        if (Object.keys(errores).length > 0) {
            setErroresFormulario(errores);
            return;
        }

        setGuardando(true);
        limpiarMensajes();
        setErroresFormulario({});

        const datosSocio = {
            cedula: formulario.cedula.trim(),
            nombres: formulario.nombres.trim(),
            apellidos: formulario.apellidos.trim(),
            correo: formulario.correo.trim().toLowerCase(),
            telefono: formulario.telefono.trim(),
            direccion: formulario.direccion.trim(),
        };

        try {
            await api.post(
                '/api/v1/socios/crear',
                datosSocio
            );

            setExito('El socio fue registrado correctamente.');
            setFormulario(FORMULARIO_INICIAL);
            setMostrarFormulario(false);
            setCedulaBusqueda('');

            await cargarSocios();

            setExito('El socio fue registrado correctamente.');
        } catch (errorPeticion) {
            setError(
                obtenerMensajeError(
                    errorPeticion,
                    'No se pudo registrar el socio.'
                )
            );
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="mb-1">Gestión de Socios</h2>

                    <p className="text-muted mb-0">
                        Consulta y registra socios de la caja de ahorro.
                    </p>
                </div>

                <div className="d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={cargarSocios}
                        disabled={cargando || buscando || guardando}
                        title="Volver a cargar todos los socios"
                        aria-label="Actualizar listado de socios"
                    >
                        Actualizar listado
                    </button>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={abrirFormulario}
                        disabled={guardando}
                        title="Abrir formulario para registrar un socio"
                        aria-label="Registrar nuevo socio"
                    >
                        Nuevo socio
                    </button>
                </div>
            </div>

            {mostrarFormulario && (
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                        <strong>Registrar nuevo socio</strong>

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
                            className="row g-3"
                            onSubmit={registrarSocio}
                            noValidate
                        >
                            <div className="col-md-4">
                                <label
                                    htmlFor="cedula"
                                    className="form-label"
                                >
                                    Cédula
                                </label>

                                <input
                                    id="cedula"
                                    name="cedula"
                                    type="text"
                                    inputMode="numeric"
                                    className={`form-control ${erroresFormulario.cedula
                                            ? 'is-invalid'
                                            : ''
                                        }`}
                                    value={formulario.cedula}
                                    onChange={manejarCambioFormulario}
                                    placeholder="10 dígitos"
                                    maxLength={10}
                                    disabled={guardando}
                                    autoFocus
                                    aria-label="Cédula del nuevo socio"
                                />

                                {erroresFormulario.cedula && (
                                    <div className="invalid-feedback">
                                        {erroresFormulario.cedula}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-4">
                                <label
                                    htmlFor="nombres"
                                    className="form-label"
                                >
                                    Nombres
                                </label>

                                <input
                                    id="nombres"
                                    name="nombres"
                                    type="text"
                                    className={`form-control ${erroresFormulario.nombres
                                            ? 'is-invalid'
                                            : ''
                                        }`}
                                    value={formulario.nombres}
                                    onChange={manejarCambioFormulario}
                                    placeholder="Nombres del socio"
                                    maxLength={100}
                                    disabled={guardando}
                                />

                                {erroresFormulario.nombres && (
                                    <div className="invalid-feedback">
                                        {erroresFormulario.nombres}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-4">
                                <label
                                    htmlFor="apellidos"
                                    className="form-label"
                                >
                                    Apellidos
                                </label>

                                <input
                                    id="apellidos"
                                    name="apellidos"
                                    type="text"
                                    className={`form-control ${erroresFormulario.apellidos
                                            ? 'is-invalid'
                                            : ''
                                        }`}
                                    value={formulario.apellidos}
                                    onChange={manejarCambioFormulario}
                                    placeholder="Apellidos del socio"
                                    maxLength={100}
                                    disabled={guardando}
                                />

                                {erroresFormulario.apellidos && (
                                    <div className="invalid-feedback">
                                        {erroresFormulario.apellidos}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-4">
                                <label
                                    htmlFor="correo"
                                    className="form-label"
                                >
                                    Correo electrónico
                                </label>

                                <input
                                    id="correo"
                                    name="correo"
                                    type="email"
                                    className={`form-control ${erroresFormulario.correo
                                            ? 'is-invalid'
                                            : ''
                                        }`}
                                    value={formulario.correo}
                                    onChange={manejarCambioFormulario}
                                    placeholder="correo@ejemplo.com"
                                    maxLength={150}
                                    disabled={guardando}
                                />

                                {erroresFormulario.correo && (
                                    <div className="invalid-feedback">
                                        {erroresFormulario.correo}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-4">
                                <label
                                    htmlFor="telefono"
                                    className="form-label"
                                >
                                    Teléfono
                                </label>

                                <input
                                    id="telefono"
                                    name="telefono"
                                    type="text"
                                    inputMode="numeric"
                                    className={`form-control ${erroresFormulario.telefono
                                            ? 'is-invalid'
                                            : ''
                                        }`}
                                    value={formulario.telefono}
                                    onChange={manejarCambioFormulario}
                                    placeholder="Ejemplo: 0999999999"
                                    maxLength={15}
                                    disabled={guardando}
                                />

                                {erroresFormulario.telefono && (
                                    <div className="invalid-feedback">
                                        {erroresFormulario.telefono}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-4">
                                <label
                                    htmlFor="direccion"
                                    className="form-label"
                                >
                                    Dirección
                                </label>

                                <input
                                    id="direccion"
                                    name="direccion"
                                    type="text"
                                    className={`form-control ${erroresFormulario.direccion
                                            ? 'is-invalid'
                                            : ''
                                        }`}
                                    value={formulario.direccion}
                                    onChange={manejarCambioFormulario}
                                    placeholder="Dirección del socio"
                                    maxLength={200}
                                    disabled={guardando}
                                />

                                {erroresFormulario.direccion && (
                                    <div className="invalid-feedback">
                                        {erroresFormulario.direccion}
                                    </div>
                                )}
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
                                        ? 'Registrando...'
                                        : 'Registrar socio'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="card shadow-sm mb-4">
                <div className="card-header bg-white">
                    <strong>Buscar socio por cédula</strong>
                </div>

                <div className="card-body">
                    <form
                        className="row g-3 align-items-end"
                        onSubmit={buscarSocio}
                    >
                        <div className="col-md-7">
                            <label
                                htmlFor="cedulaBusqueda"
                                className="form-label"
                            >
                                Cédula
                            </label>

                            <input
                                id="cedulaBusqueda"
                                type="text"
                                inputMode="numeric"
                                className="form-control"
                                placeholder="Ingrese 10 dígitos"
                                value={cedulaBusqueda}
                                onChange={manejarCambioCedulaBusqueda}
                                maxLength={10}
                                autoComplete="off"
                                aria-label="Buscar socio por número de cédula"
                            />

                            <div className="form-text">
                                Solo se permiten números.
                            </div>
                        </div>

                        <div className="col-md-3">
                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={
                                    buscando ||
                                    cargando ||
                                    guardando
                                }
                            >
                                {buscando ? 'Buscando...' : 'Buscar'}
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

            <div className="card shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <strong>Socios registrados</strong>

                    <span className="badge text-bg-primary">
                        {socios.length}
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
                                Cargando socios...
                            </p>
                        </div>
                    ) : socios.length === 0 ? (
                        <div className="text-center py-5 px-3">
                            <h5 className="mb-2">
                                No hay socios para mostrar
                            </h5>

                            <p className="text-muted mb-0">
                                Registra un socio o realiza otra búsqueda.
                            </p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Cédula</th>
                                        <th>Socio</th>
                                        <th>Correo</th>
                                        <th>Teléfono</th>
                                        <th>Dirección</th>
                                        <th>Fecha de ingreso</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {socios.map((socio) => (
                                        <tr key={socio.idSocio}>
                                            <td>{socio.idSocio}</td>

                                            <td>
                                                <span className="fw-semibold">
                                                    {socio.cedula}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="fw-semibold">
                                                    {socio.nombres}{' '}
                                                    {socio.apellidos}
                                                </div>
                                            </td>

                                            <td>
                                                {socio.correo ||
                                                    'No registrado'}
                                            </td>

                                            <td>
                                                {socio.telefono ||
                                                    'No registrado'}
                                            </td>

                                            <td>
                                                {socio.direccion ||
                                                    'No registrada'}
                                            </td>

                                            <td>
                                                {formatearFecha(
                                                    socio.fechaIngreso
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${socio.activo
                                                            ? 'text-bg-success'
                                                            : 'text-bg-secondary'
                                                        }`}
                                                >
                                                    {socio.activo
                                                        ? 'Activo'
                                                        : 'Inactivo'}
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

export default Socios;