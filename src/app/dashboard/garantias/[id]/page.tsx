'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { formatearFecha, formatearMoneda } from '@/lib/utils';

interface Garantia {
  id: string;
  codigo: string;
  clienteReporte: string;
  fotos: string[];
  fechaReporte: string;
  estado: string;
  cubierta: boolean | null;
  motivoRechazo: string | null;
  ordenReparacion: string | null;
  resolucion: string | null;
  resueltaEn: string | null;
  order: {
    codigo: string;
    fechaFin: string | null;
    fotosDespues: string[];
    quote: {
      total: number;
      lead: {
        clienteNombre: string;
        clienteTelefono: string;
        clienteEmail: string | null;
        direccion: string;
      };
      service: {
        nombre: string;
        icono: string;
      };
    };
    maestro: {
      firstName: string;
      lastName: string;
      phone: string;
    } | null;
  };
}

const ESTADOS = [
  { value: 'REPORTADA', label: '🆕 Reportada' },
  { value: 'EN_REVISION', label: '🔍 En Revisión' },
  { value: 'APROBADA', label: '✅ Aprobada' },
  { value: 'RECHAZADA', label: '❌ Rechazada' },
  { value: 'EN_REPARACION', label: '🔧 En Reparación' },
  { value: 'RESUELTA', label: '✔️ Resuelta' },
];

export default function DetalleGarantiaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [garantia, setGarantia] = useState<Garantia | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [form, setForm] = useState({
    estado: '',
    cubierta: null as boolean | null,
    motivoRechazo: '',
    ordenReparacion: '',
    resolucion: '',
  });

  useEffect(() => {
    cargarGarantia();
  }, [id]);

  const cargarGarantia = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/garantias/${id}`);
      const data = await res.json();
      
      setGarantia(data);
      setForm({
        estado: data.estado,
        cubierta: data.cubierta,
        motivoRechazo: data.motivoRechazo || '',
        ordenReparacion: data.ordenReparacion || '',
        resolucion: data.resolucion || '',
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar garantía');
    } finally {
      setLoading(false);
    }
  };

  const guardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.estado === 'RECHAZADA' && !form.motivoRechazo.trim()) {
      alert('Debes especificar el motivo del rechazo');
      return;
    }

    if (form.estado === 'RESUELTA' && !form.resolucion.trim()) {
      alert('Debes especificar cómo se resolvió');
      return;
    }

    try {
      setGuardando(true);
      const res = await fetch(`/api/garantias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert('✅ Garantía actualizada');
        cargarGarantia();
      } else {
        alert('❌ Error al actualizar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  const diasGarantia = 90; // Puedes hacer esto configurable después
  const diasTranscurridos = garantia?.order.fechaFin 
    ? Math.floor((new Date().getTime() - new Date(garantia.order.fechaFin).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const diasRestantes = diasGarantia - diasTranscurridos;
  const vigente = diasRestantes > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando garantía...</p>
        </div>
      </div>
    );
  }

  if (!garantia) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-600">❌ Garantía no encontrada</p>
          <Link href="/dashboard/garantias" className="text-blue-600 underline mt-4 inline-block">
            ← Volver a garantías
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Garantía {garantia.codigo}</h1>
              <p className="text-gray-600 mt-1">Orden: {garantia.order.codigo}</p>
            </div>
            <Link
              href="/dashboard/garantias"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-all"
            >
              ← Volver
            </Link>
          </div>

          {/* Estado de vigencia */}
          <div className={`mt-4 p-4 rounded-lg ${vigente ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{vigente ? '✅' : '⚠️'}</span>
              <div>
                <div className="font-semibold text-gray-900">
                  {vigente ? 'Garantía vigente' : 'Garantía vencida'}
                </div>
                <div className="text-sm text-gray-600">
                  {vigente 
                    ? `${diasRestantes} días restantes de ${diasGarantia} días totales`
                    : `Venció hace ${Math.abs(diasRestantes)} días`
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Información del cliente */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">👤 Información del Cliente</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Nombre</div>
                <div className="font-semibold text-gray-900">{garantia.order.quote.lead.clienteNombre}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Teléfono</div>
                <div className="font-semibold text-gray-900">{garantia.order.quote.lead.clienteTelefono}</div>
              </div>
              {garantia.order.quote.lead.clienteEmail && (
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-semibold text-gray-900">{garantia.order.quote.lead.clienteEmail}</div>
                </div>
              )}
              <div>
                <div className="text-sm text-gray-500">Dirección</div>
                <div className="font-semibold text-gray-900">{garantia.order.quote.lead.direccion}</div>
              </div>
            </div>

            <a
              href={`https://wa.me/${garantia.order.quote.lead.clienteTelefono.replace(/\D/g, '')}?text=Hola, te contacto sobre la garantía ${garantia.codigo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold transition-all inline-flex items-center justify-center gap-2"
            >
              💬 Contactar por WhatsApp
            </a>
          </div>

          {/* Información del servicio */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🛠️ Información del Servicio</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Servicio</div>
                <div className="font-semibold text-gray-900">
                  {garantia.order.quote.service.icono} {garantia.order.quote.service.nombre}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total pagado</div>
                <div className="font-semibold text-gray-900">{formatearMoneda(garantia.order.quote.total)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Fecha de finalización</div>
                <div className="font-semibold text-gray-900">
                  {garantia.order.fechaFin ? formatearFecha(new Date(garantia.order.fechaFin)) : 'No finalizado'}
                </div>
              </div>
              {garantia.order.maestro && (
                <div>
                  <div className="text-sm text-gray-500">Maestro asignado</div>
                  <div className="font-semibold text-gray-900">
                    {garantia.order.maestro.firstName} {garantia.order.maestro.lastName}
                  </div>
                  <div className="text-sm text-gray-600">{garantia.order.maestro.phone}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reporte del cliente */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📝 Reporte del Cliente</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Fecha de reporte: {formatearFecha(new Date(garantia.fechaReporte))}</div>
            <div className="text-gray-900 whitespace-pre-wrap">{garantia.clienteReporte}</div>
          </div>

          {garantia.fotos.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">Fotos del problema:</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {garantia.fotos.map((foto, i) => (
                  <a key={i} href={foto} target="_blank" rel="noopener noreferrer">
                    <img src={foto} alt={`Foto ${i + 1}`} className="w-full h-32 object-cover rounded-lg border hover:opacity-80 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Formulario de actualización */}
        <form onSubmit={guardarCambios} className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">✏️ Actualizar Garantía</h2>

          {/* Estado */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Estado *</label>
            <select
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {ESTADOS.map((e) => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>

          {/* Cubierta o no */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">¿Está cubierta por la garantía?</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setForm({ ...form, cubierta: true })}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                  form.cubierta === true
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ✅ Sí, está cubierta
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, cubierta: false })}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                  form.cubierta === false
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ❌ No está cubierta
              </button>
            </div>
          </div>

          {/* Motivo rechazo (si está rechazada) */}
          {form.estado === 'RECHAZADA' && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Motivo del rechazo *</label>
              <textarea
                value={form.motivoRechazo}
                onChange={(e) => setForm({ ...form, motivoRechazo: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Explica por qué no está cubierta..."
                required
              />
            </div>
          )}

          {/* Orden de reparación */}
          {form.cubierta && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Orden de reparación</label>
              <input
                type="text"
                value={form.ordenReparacion}
                onChange={(e) => setForm({ ...form, ordenReparacion: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Código de la orden de reparación (si aplica)"
              />
            </div>
          )}

          {/* Resolución (si está resuelta) */}
          {form.estado === 'RESUELTA' && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Resolución *</label>
              <textarea
                value={form.resolucion}
                onChange={(e) => setForm({ ...form, resolucion: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Describe cómo se resolvió el problema..."
                required
              />
            </div>
          )}

          {/* Botón guardar */}
          <button
            type="submit"
            disabled={guardando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all disabled:opacity-50"
          >
            {guardando ? '⏳ Guardando...' : '💾 Guardar Cambios'}
          </button>
        </form>

        {/* Historial (si está resuelta) */}
        {garantia.resueltaEn && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
            <h2 className="text-xl font-bold text-green-900 mb-2">✅ Garantía Resuelta</h2>
            <p className="text-sm text-green-700">
              Resuelta el: {formatearFecha(new Date(garantia.resueltaEn))}
            </p>
            {garantia.resolucion && (
              <div className="mt-3 bg-white p-4 rounded-lg">
                <div className="text-sm font-semibold text-gray-700 mb-1">Resolución:</div>
                <div className="text-gray-900 whitespace-pre-wrap">{garantia.resolucion}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}