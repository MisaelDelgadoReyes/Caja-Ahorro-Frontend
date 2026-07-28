import { useState } from 'react';
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
        <div className="container-fluid py-2">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="mb-1 text-dark fw-bold">Transacciones de Ventanilla</h2>
                    <p className="text-muted mb-0">
                        Registra depósitos y retiros y revisa el historial de la sesión.
                    </p>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-5">
                    <div className="saas-card border-0 h-100">
                        <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4">
                            <h6 className="mb-0 fw-bold text-dark">Registrar transacción</h6>
                        </div>
                        <div className="card-body px-4 pb-4">
                            {error && <div className="alert alert-danger border-0 rounded-3 py-2 mb-4" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>{error}</div>}
                            <form onSubmit={handleRegistrar}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>ID del socio</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="socioId"
                                        value={form.socioId}
                                        onChange={handleChange}
                                        placeholder="Ej. 1"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Tipo de transacción</label>
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
                                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>Monto ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        className="form-control fw-semibold"
                                        name="monto"
                                        value={form.monto}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
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
                                <button type="submit" className="btn btn-primary w-100 py-2 fw-medium" disabled={guardando}>
                                    {guardando ? 'Registrando...' : 'Registrar transacción'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-7">
                    <div className="saas-card border-0 h-100">
                        <div className="card-header bg-white border-bottom-0 pt-4 pb-2 px-4">
                            <h6 className="mb-0 fw-bold text-dark">Historial de esta sesión</h6>
                        </div>
                        <div className="card-body px-0 pb-0">
                            {historial.length === 0 ? (
                                <div className="text-center py-5 px-3">
                                    <div style={{ fontSize: '40px', opacity: 0.5 }}>🧾</div>
                                    <h6 className="mb-2 mt-3 fw-semibold text-dark">No hay transacciones</h6>
                                    <p className="text-muted mb-0 small">
                                        Aún no has registrado transacciones en esta sesión.
                                    </p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-4">ID</th>
                                                <th>Tipo</th>
                                                <th>Monto</th>
                                                <th>Mensaje</th>
                                                <th className="pe-4">Fecha</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {historial.map((t, idx) => (
                                                <tr key={t.transaccionId ?? idx}>
                                                    <td className="ps-4 fw-medium text-muted">#{t.transaccionId}</td>
                                                    <td>
                                                        <span
                                                            className={`badge ${
                                                                t.tipoTransaccion === 'DEPOSITO'
                                                                    ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-25'
                                                                    : 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25'
                                                            }`}
                                                        >
                                                            {t.tipoTransaccion}
                                                        </span>
                                                    </td>
                                                    <td className="fw-bold text-dark">${Number(t.monto).toFixed(2)}</td>
                                                    <td><span className="text-muted" style={{ fontSize: '13px' }}>{t.mensaje}</span></td>
                                                    <td className="pe-4 text-muted" style={{ fontSize: '13px' }}>
                                                        {t.fecha ? new Date(t.fecha).toLocaleString() : '-'}
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
            </div>
        </div>
    );
};

export default Transacciones;

// Vista general de las transacciones del usuario