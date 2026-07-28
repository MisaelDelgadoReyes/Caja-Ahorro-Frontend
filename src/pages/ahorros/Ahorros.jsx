import { useState } from 'react';
import api from '../../api/axios';

const initialTransaccion = {
    tipoTransaccion: 'DEPOSITO',
    monto: '',
    cuentaContable: '',
};

// El backend envuelve las respuestas de Socios/Cuentas en ResponseRest<T>: { data: [...], errors: [...] }
const extraerLista = (res) => (Array.isArray(res.data?.data) ? res.data.data : []);

const extraerMensajeError = (err, fallback) => {
    const backendError = err.response?.data?.errors?.[0];
    return backendError?.mensaje || fallback;
};

const Ahorros = () => {
    const [cedula, setCedula] = useState('');
    const [buscando, setBuscando] = useState(false);
    const [errorBusqueda, setErrorBusqueda] = useState('');
    const [socio, setSocio] = useState(null);
    const [cuentasAhorro, setCuentasAhorro] = useState([]);

    const [form, setForm] = useState(initialTransaccion);
    const [guardando, setGuardando] = useState(false);
    const [errorTransaccion, setErrorTransaccion] = useState('');
    const [ultimoResultado, setUltimoResultado] = useState(null);

    const handleBuscarSocio = async (e) => {
        e.preventDefault();
        const valor = cedula.trim();
        if (!valor) return;

        setBuscando(true);
        setErrorBusqueda('');
        setSocio(null);
        setCuentasAhorro([]);
        setUltimoResultado(null);

        try {
            const [resSocio, resCuentas] = await Promise.all([
                api.get(`/api/v1/socios/cedula/${valor}`),
                api.get(`/api/v1/cuentas/socio/${valor}`),
            ]);

            const socios = extraerLista(resSocio);
            const cuentas = extraerLista(resCuentas);

            if (socios.length === 0) {
                setErrorBusqueda('No se encontró ningún socio con esa cédula.');
                return;
            }

            setSocio(socios[0]);
            setCuentasAhorro(cuentas.filter((c) => c.tipoCuenta === 'AHORRO'));
        } catch (err) {
            setErrorBusqueda(extraerMensajeError(err, 'No se pudo consultar al socio.'));
        } finally {
            setBuscando(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegistrar = async (e) => {
        e.preventDefault();
        if (!socio) return;

        setGuardando(true);
        setErrorTransaccion('');
        try {
            const payload = {
                socioId: socio.idSocio,
                tipoTransaccion: form.tipoTransaccion,
                monto: Number(form.monto),
                cuentaContable: form.cuentaContable,
            };
            const res = await api.post('/api/v1/contabilidad/ventanilla/transaccion', payload);
            setUltimoResultado({ ...res.data, tipoTransaccion: form.tipoTransaccion, monto: payload.monto });
            setForm(initialTransaccion);
        } catch (err) {
            setErrorTransaccion(
                extraerMensajeError(err, 'No se pudo registrar la transacción de ahorro.')
            );
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="container-fluid py-2">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="mb-1 text-dark fw-bold">Ahorros</h2>
                    <p className="text-muted mb-0">
                        Gestiona los depósitos y retiros de ahorro de los socios.
                    </p>
                </div>
            </div>

            <div className="saas-card mb-4 border-0">
                <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4">
                    <h6 className="mb-0 fw-bold text-dark">Buscar socio</h6>
                </div>
                <div className="card-body px-4 pb-4">
                    <form className="d-flex flex-column flex-sm-row gap-2 mb-2" onSubmit={handleBuscarSocio}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Cédula del socio (10 dígitos)"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            maxLength={10}
                            style={{ maxWidth: '300px' }}
                        />
                        <button type="submit" className="btn btn-primary px-4" disabled={buscando}>
                            {buscando ? 'Buscando...' : 'Buscar'}
                        </button>
                    </form>
                    {errorBusqueda && <div className="alert alert-danger border-0 rounded-3 mt-3 py-2 mb-0" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>{errorBusqueda}</div>}

                    {socio && (
                        <div className="mt-4 pt-4 border-top">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
                                <div>
                                    <h6 className="fw-semibold text-dark mb-1">
                                        {socio.nombres} {socio.apellidos}
                                    </h6>
                                    <span className="text-muted" style={{ fontSize: '13px' }}>C.I: {socio.cedula}</span>
                                </div>
                            </div>
                            
                            {cuentasAhorro.length === 0 ? (
                                <div className="alert alert-info border-0 rounded-3 py-2 mb-0" style={{ backgroundColor: '#e0f2fe', color: '#075985' }}>
                                    Este socio no tiene cuentas de ahorro.
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-3">N° Cuenta</th>
                                                <th className="pe-3 text-end">Saldo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cuentasAhorro.map((c) => (
                                                <tr key={c.idCuenta ?? c.numeroCuenta}>
                                                    <td className="ps-3 fw-semibold text-dark">{c.numeroCuenta}</td>
                                                    <td className="pe-3 text-end fw-bold text-primary">${Number(c.saldo).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {socio && (
                <div className="saas-card border-0">
                    <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4">
                        <h6 className="mb-0 fw-bold text-dark">Registrar depósito / retiro de ahorro</h6>
                    </div>
                    <div className="card-body px-4 pb-4">
                        <div className="alert alert-warning border-0 rounded-3 py-2 small mb-4" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                            💡 El saldo mostrado arriba no se actualiza automáticamente al registrar el movimiento
                            (el backend solo genera el asiento contable, no modifica el saldo de la cuenta). Vuelve a
                            buscar al socio para ver el saldo actualizado una vez que se sincronice.
                        </div>
                        {ultimoResultado && (
                            <div className="alert alert-success border-0 rounded-3 py-2 mb-4" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
                                {ultimoResultado.mensaje} (Transacción #{ultimoResultado.transaccionId})
                            </div>
                        )}
                        {errorTransaccion && <div className="alert alert-danger border-0 rounded-3 py-2 mb-4" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>{errorTransaccion}</div>}
                        
                        <form onSubmit={handleRegistrar} className="row g-4">
                            <div className="col-md-4">
                                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Tipo</label>
                                <select
                                    className="form-select"
                                    name="tipoTransaccion"
                                    value={form.tipoTransaccion}
                                    onChange={handleChange}
                                >
                                    <option value="DEPOSITO">Depósito</option>
                                    <option value="RETIRO">Retiro</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Monto ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    className="form-control fw-semibold"
                                    name="monto"
                                    value={form.monto}
                                    onChange={handleChange}
                                    required
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Cuenta contable</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="cuentaContable"
                                    value={form.cuentaContable}
                                    onChange={handleChange}
                                    placeholder="Ej. 1010101"
                                    required
                                />
                            </div>
                            <div className="col-12 mt-4 pt-3 border-top d-flex justify-content-end">
                                <button type="submit" className="btn btn-primary px-4" disabled={guardando}>
                                    {guardando ? 'Registrando...' : 'Registrar movimiento'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ahorros;

// Componente principal de la vista de ahorros