import React, { useState } from 'react';
import api from '../../api/axios';

const initialForm = {
    socioId: '',
    tipoTransaccion: 'DEPOSITO',
    monto: '',
    cuentaContable: '',
};

const Transacciones = () => {
    const [form, setForm] = useState(initialForm);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');
    const [historial, setHistorial] = useState([]); // Solo de esta sesión: no hay endpoint de consulta

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegistrar = async (e) => {
        e.preventDefault();
        setGuardando(true);
        setError('');
        try {
            const payload = {
                ...form,
                socioId: Number(form.socioId),
                monto: Number(form.monto),
            };
            const res = await api.post('/api/v1/contabilidad/ventanilla/transaccion', payload);
            setHistorial((prev) => [
                { ...res.data, tipoTransaccion: form.tipoTransaccion, monto: payload.monto },
                ...prev,
            ]);
            setForm(initialForm);
        } catch (err) {
            const backendError = err.response?.data?.errors?.[0];
            setError(
                backendError?.mensaje ||
                    err.response?.data?.mensaje ||
                    'No se pudo registrar la transacción. Verifica los datos.'
            );
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div>
            <h2 className="mb-4">Transacciones de Ventanilla</h2>

            <div className="row g-4">
                <div className="col-lg-5">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white">
                            <strong>Registrar transacción</strong>
                        </div>
                        <div className="card-body">
                            {error && <div className="alert alert-danger py-2">{error}</div>}
                            <form onSubmit={handleRegistrar}>
                                <div className="mb-3">
                                    <label className="form-label">ID del socio</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="socioId"
                                        value={form.socioId}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Tipo de transacción</label>
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
                                <div className="mb-3">
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
                                <div className="mb-3">
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
                                <button type="submit" className="btn btn-primary w-100" disabled={guardando}>
                                    {guardando ? 'Registrando...' : 'Registrar transacción'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-7">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white">
                            <strong>Historial de esta sesión</strong>
                        </div>
                        <div className="card-body">
                            {historial.length === 0 ? (
                                <p className="text-muted">
                                    Aún no has registrado transacciones en esta sesión.
                                </p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead>
                                            <tr>
                                                <th>ID Transacción</th>
                                                <th>Tipo</th>
                                                <th>Monto</th>
                                                <th>Mensaje</th>
                                                <th>Fecha</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {historial.map((t, idx) => (
                                                <tr key={t.transaccionId ?? idx}>
                                                    <td>{t.transaccionId}</td>
                                                    <td>
                                                        <span
                                                            className={`badge ${
                                                                t.tipoTransaccion === 'DEPOSITO'
                                                                    ? 'bg-success'
                                                                    : 'bg-warning text-dark'
                                                            }`}
                                                        >
                                                            {t.tipoTransaccion}
                                                        </span>
                                                    </td>
                                                    <td>${Number(t.monto).toFixed(2)}</td>
                                                    <td>{t.mensaje}</td>
                                                    <td>{t.fecha ? new Date(t.fecha).toLocaleString() : '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transacciones;

// Vista general de las transacciones del usuario