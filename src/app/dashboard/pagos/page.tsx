'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatearFecha, formatearMoneda } from '@/lib/utils';

interface PagoCliente {
  id: string;
  tipo: string;
  metodo: string;
  monto: number;
  fecha: string;
  validado: boolean;
  referencia: string | null;
  comprobanteUrl: string | null;
  order: {
    codigo: string;
    quote: {
      lead: {
        clienteNombre: string;
        clienteTelefono: string;
      };
    };
  };
}

interface PagoMaestro {
  id: string;
  monto: number;
  metodo: string;
  fecha: string;
  referencia: string | null;
  notas: string | null;
  maestro: {
    nombre: string;
    telefono: string;
  };
  order: {
    codigo: string;
  } | null;
}

const TIPOS_PAGO = [
  { value: 'ANTICIPO', label: 'Anticipo', color: 'blue' },
  { value: 'SALDO', label: 'Saldo', color: 'green' },
  { value: 'ADICIONAL', label: 'Adicional', color: 'purple' },
];

const METODOS_PAGO = [
  { value: 'TRANSFERENCIA', label: 'Transferencia', icon: '🏦' },
  { value: 'EFECTIVO', label: 'Efectivo', icon: '💵' },
  { value: 'OTRO', label: 'Otro', icon: '💳' },
];

export default function PagosPage() {
  const [tab, setTab] = useState<'recibidos' | 'pagados'>('recibidos');
  const [pagosClientes, setPagosClientes] = useState<PagoCliente[]>([]);
  const [pagosMaestros, setPagosMaestros] = useState<PagoMaestro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resClientes, resMaestros] = await Promise.all([
        fetch('/api/pagos/clientes'),
        fetch('/api/pagos/maestros'),
      ]);

      if (resClientes.ok) {
        const data = await resClientes.json();
        setPagosClientes(Array.isArray(data) ? data : []);
      }

      if (resMaestros.ok) {
        const data = await resMaestros.json();
        setPagosMaestros(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar pagos');
    } finally {
      setLoading(false);
    }
  };

  const validarPago = async (id: string, validado: boolean) => {
    try {
      const res = await fetch(`/api/pagos/clientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ validado }),
      });

      if (res.ok) {
        alert(validado ? '✅ Pago validado' : '⚠️ Validación removida');
        cargarDatos();
      } else {
        alert('❌ Error al validar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al validar');
    }
  };

  const eliminarPagoCliente = async (id: string) => {
    if (!confirm('¿Eliminar este pago?')) return;

    try {
      const res = await fetch(`/api/pagos/clientes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('✅ Pago eliminado');
        cargarDatos();
      } else {
        alert('❌ Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al eliminar');
    }
  };

  const eliminarPagoMaestro = async (id: string) => {
    if (!confirm('¿Eliminar este pago?')) return;

    try {
      const res = await fetch(`/api/pagos/maestros/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('✅ Pago eliminado');
        cargarDatos();
      } else {
        alert('❌ Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al eliminar');
    }
  };

  const getTipoBadge = (tipo: string) => {
    const tipoInfo = TIPOS_PAGO.find(t => t.value === tipo);
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[tipoInfo?.color as keyof typeof colors]}`}>
        {tipoInfo?.label || tipo}
      </span>
    );
  };

  const getMetodoIcon = (metodo: string) => {
    return METODOS_PAGO.find(m => m.value === metodo)?.icon || '💳';
  };

  // Estadísticas clientes
  const totalRecibido = pagosClientes.reduce((sum, p) => sum + Number(p.monto), 0);
  const pendientesValidar = pagosClientes.filter(p => !p.validado).length;
  const porTransferencia = pagosClientes.filter(p => p.metodo === 'TRANSFERENCIA').reduce((sum, p) => sum + Number(p.monto), 0);
  const porEfectivo = pagosClientes.filter(p => p.metodo === 'EFECTIVO').reduce((sum, p) => sum + Number(p.monto), 0);

  // Estadísticas maestros
  const totalPagado = pagosMaestros.reduce((sum, p) => sum + Number(p.monto), 0);
  
  // Resumen por maestro
  const resumenMaestros = pagosMaestros.reduce((acc, pago) => {
    const nombre = pago.maestro.nombre;
    if (!acc[nombre]) {
      acc[nombre] = { total: 0, count: 0 };
    }
    acc[nombre].total += Number(pago.monto);
    acc[nombre].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">💰 Gestión de Pagos</h1>
              <p className="text-gray-600 mt-1">Control de ingresos y egresos</p>
            </div>
            <Link
              href="/dashboard"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Volver
            </Link>
          </div>
        </div>
      </div>

      {/* Pestañas */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setTab('recibidos')}
              className={`px-6 py-4 font-semibold transition-all ${
                tab === 'recibidos'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              💰 Recibidos (Clientes)
            </button>
            <button
              onClick={() => setTab('pagados')}
              className={`px-6 py-4 font-semibold transition-all ${
                tab === 'pagados'
                  ? 'border-b-2 border-orange-600 text-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              💸 Pagados (Maestros)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando...</p>
          </div>
        ) : (
          <>
            {/* TAB: Recibidos */}
            {tab === 'recibidos' && (
              <>
                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-500">Total Recibido</div>
                    <div className="text-3xl font-bold text-green-600 mt-2">
                      {formatearMoneda(totalRecibido)}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-500">Pendientes Validar</div>
                    <div className="text-3xl font-bold text-yellow-600 mt-2">
                      {pendientesValidar}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-500">Por Transferencia</div>
                    <div className="text-2xl font-bold text-blue-600 mt-2">
                      {formatearMoneda(porTransferencia)}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-500">En Efectivo</div>
                    <div className="text-2xl font-bold text-emerald-600 mt-2">
                      {formatearMoneda(porEfectivo)}
                    </div>
                  </div>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orden / Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pagosClientes.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                            No hay pagos registrados
                          </td>
                        </tr>
                      ) : (
                        pagosClientes.map((pago) => (
                          <tr key={pago.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {formatearFecha(new Date(pago.fecha))}
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-gray-900">{pago.order.codigo}</div>
                              <div className="text-sm text-gray-500">{pago.order.quote.lead.clienteNombre}</div>
                            </td>
                            <td className="px-6 py-4">
                              {getTipoBadge(pago.tipo)}
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-2xl mr-2">{getMetodoIcon(pago.metodo)}</span>
                              <span className="text-sm text-gray-600">{pago.metodo}</span>
                              {pago.referencia && (
                                <div className="text-xs text-gray-400 mt-1">Ref: {pago.referencia}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900">
                              {formatearMoneda(pago.monto)}
                            </td>
                            <td className="px-6 py-4">
                              {pago.validado ? (
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                  ✅ Validado
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                                  ⏳ Pendiente
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                {!pago.validado && (
                                  <button
                                    onClick={() => validarPago(pago.id, true)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold transition-all"
                                  >
                                    ✓ Validar
                                  </button>
                                )}
                                {pago.validado && (
                                  <button
                                    onClick={() => validarPago(pago.id, false)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-semibold transition-all"
                                  >
                                    ↩ Revertir
                                  </button>
                                )}
                                <button
                                  onClick={() => eliminarPagoCliente(pago.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold transition-all"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* TAB: Pagados */}
            {tab === 'pagados' && (
              <>
                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-500">Total Pagado</div>
                    <div className="text-3xl font-bold text-orange-600 mt-2">
                      {formatearMoneda(totalPagado)}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-500">Total Pagos</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">
                      {pagosMaestros.length}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-500">Maestros</div>
                    <div className="text-3xl font-bold text-indigo-600 mt-2">
                      {Object.keys(resumenMaestros).length}
                    </div>
                  </div>
                </div>

                {/* Resumen por Maestro */}
                {Object.keys(resumenMaestros).length > 0 && (
                  <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Resumen por Maestro</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(resumenMaestros).map(([nombre, data]) => (
                        <div key={nombre} className="bg-gray-50 rounded-lg p-4">
                          <div className="font-semibold text-gray-900">{nombre}</div>
                          <div className="text-2xl font-bold text-orange-600 mt-2">
                            {formatearMoneda(data.total)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {data.count} pago{data.count !== 1 ? 's' : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tabla */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Maestro</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orden</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notas</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pagosMaestros.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                            No hay pagos a maestros registrados
                          </td>
                        </tr>
                      ) : (
                        pagosMaestros.map((pago) => (
                          <tr key={pago.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {formatearFecha(new Date(pago.fecha))}
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-gray-900">{pago.maestro.nombre}</div>
                              <div className="text-sm text-gray-500">{pago.maestro.telefono}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {pago.order?.codigo || '-'}
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-2xl mr-2">{getMetodoIcon(pago.metodo)}</span>
                              <span className="text-sm text-gray-600">{pago.metodo}</span>
                              {pago.referencia && (
                                <div className="text-xs text-gray-400 mt-1">Ref: {pago.referencia}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900">
                              {formatearMoneda(pago.monto)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                              {pago.notas || '-'}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => eliminarPagoMaestro(pago.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold transition-all"
                              >
                                🗑️ Eliminar
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}