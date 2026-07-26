import React, { useState } from 'react';
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
        <div>
            <h2 className="mb-4">Ahorros</h2>

            <div className="card shadow-sm mb-4">
                <div className="card-header bg-white">
                    <strong>Buscar socio</strong>
                </div>
                <div className="card-body">
                    <form className="d-flex gap-2 mb-2" onSubmit={handleBuscarSocio}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Cédula del socio"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            maxLength={10}
                        />
                        <button type="submit" className="btn btn-outline-secondary" disabled={buscando}>
                            {buscando ? 'Buscando...' : 'Buscar'}
                        </button>
                    </form>
                    {errorBusqueda && <div className="alert alert-danger py-2 mb-0">{errorBusqueda}</div>}

                    {socio && (
                        <div className="mt-3">
                            <p className="mb-2">
                                <strong>Socio:</strong> {socio.nombres} {socio.apellidos} ({socio.cedula})
                            </p>
                            {cuentasAhorro.length === 0 ? (
                                <p className="text-muted">Este socio no tiene cuentas de ahorro.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-sm table-hover align-middle">
                                        <thead>
                                            <tr>
                                                <th>N° Cuenta</th>
                                                <th>Saldo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cuentasAhorro.map((c) => (
                                                <tr key={c.idCuenta ?? c.numeroCuenta}>
                                                    <td>{c.numeroCuenta}</td>
                                                    <td>${Number(c.saldo).toFixed(2)}</td>
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
                <div className="card shadow-sm">
                    <div className="card-header bg-white">
                        <strong>Registrar depósito / retiro de ahorro</strong>
                    </div>
                    <div className="card-body">
                        <div className="alert alert-warning py-2 small mb-3">
                            El saldo mostrado arriba no se actualiza automáticamente al registrar el movimiento
                            (el backend solo genera el asiento contable, no modifica el saldo de la cuenta). Vuelve a
                            buscar al socio para ver el saldo actualizado una vez que se sincronice.
                        </div>
                        {ultimoResultado && (
                            <div className="alert alert-success py-2">
                                {ultimoResultado.mensaje} (Transacción #{ultimoResultado.transaccionId})
                            </div>
                        )}
                        {errorTransaccion && <div className="alert alert-danger py-2">{errorTransaccion}</div>}
                        <form onSubmit={handleRegistrar} className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label">Tipo</label>
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
                                <label className="form-label">Monto</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    className="form-control"
                                    name="monto"
                                    value={form.monto}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Cuenta contable</label>
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
                            <div className="col-12">
                                <button type="submit" className="btn btn-primary" disabled={guardando}>
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