'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatearFecha } from '@/lib/utils';

interface Garantia {
  id: string;
  codigo: string;
  clienteReporte: string;
  fechaReporte: string;
  estado: string;
  cubierta: boolean | null;
  order: {
    codigo: string;
    quote: {
      lead: {
        clienteNombre: string;
        clienteTelefono: string;
      };
      service: {
        nombre: string;
      };
    };
  };
}

const ESTADOS = [
  { value: '', label: 'Todas' },
  { value: 'REPORTADA', label: '🆕 Reportada', color: 'blue' },
  { value: 'EN_REVISION', label: '🔍 En Revisión', color: 'yellow' },
  { value: 'APROBADA', label: '✅ Aprobada', color: 'green' },
  { value: 'RECHAZADA', label: '❌ Rechazada', color: 'red' },
  { value: 'EN_REPARACION', label: '🔧 En Reparación', color: 'purple' },
  { value: 'RESUELTA', label: '✔️ Resuelta', color: 'gray' },
];

export default function GarantiasPage() {
  const [garantias, setGarantias] = useState<Garantia[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
    cargarGarantias();
  }, [filtroEstado]);

  const cargarGarantias = async () => {
  try {
    setLoading(true);
    const url = filtroEstado 
      ? `/api/garantias?estado=${filtroEstado}` 
      : '/api/garantias';
    
    const res = await fetch(url);
    const data = await res.json();
    
    // ✅ Validar que sea un array
    if (Array.isArray(data)) {
      setGarantias(data);
    } else {
      console.error('La API no devolvió un array:', data);
      setGarantias([]);
      alert('Error al cargar garantías: ' + (data.error || 'Respuesta inesperada'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al cargar garantías');
    setGarantias([]);
  } finally {
    setLoading(false);
  }
};

  const getEstadoBadge = (estado: string) => {
    const estadoInfo = ESTADOS.find(e => e.value === estado);
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      purple: 'bg-purple-100 text-purple-800',
      gray: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[estadoInfo?.color as keyof typeof colors]}`}>
        {estadoInfo?.label || estado}
      </span>
    );
  };

  const estadisticas = {
    total: garantias.length,
    reportadas: garantias.filter(g => g.estado === 'REPORTADA').length,
    enProceso: garantias.filter(g => ['EN_REVISION', 'APROBADA', 'EN_REPARACION'].includes(g.estado)).length,
    resueltas: garantias.filter(g => g.estado === 'RESUELTA').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🛡️ Gestión de Garantías</h1>
              <p className="text-gray-600 mt-1">Administra casos de garantía</p>
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

      {/* Estadísticas */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Total garantías</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{estadisticas.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Reportadas</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">{estadisticas.reportadas}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">En proceso</div>
            <div className="text-3xl font-bold text-yellow-600 mt-2">{estadisticas.enProceso}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Resueltas</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{estadisticas.resueltas}</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-semibold text-gray-700 self-center">Filtrar:</span>
            {ESTADOS.map((estado) => (
              <button
                key={estado.value}
                onClick={() => setFiltroEstado(estado.value)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  filtroEstado === estado.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {estado.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando garantías...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {garantias.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No hay garantías {filtroEstado && 'con ese estado'}
                    </td>
                  </tr>
                ) : (
                  garantias.map((g) => (
                    <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-blue-600">{g.codigo}</div>
                        <div className="text-xs text-gray-500">Orden: {g.order.codigo}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{g.order.quote.lead.clienteNombre}</div>
                        <div className="text-sm text-gray-500">{g.order.quote.lead.clienteTelefono}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{g.order.quote.service.nombre}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatearFecha(new Date(g.fechaReporte))}
                      </td>
                      <td className="px-6 py-4">
                        {getEstadoBadge(g.estado)}
                        {g.cubierta !== null && (
                          <div className="mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${g.cubierta ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {g.cubierta ? '✅ Cubierta' : '❌ No cubierta'}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/garantias/${g.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all inline-block"
                        >
                          👁️ Ver Detalle
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}