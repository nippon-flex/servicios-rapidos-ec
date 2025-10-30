'use client';

import { useState, useEffect } from 'react';
import { formatearMoneda } from '@/lib/utils';
import Link from 'next/link';

interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  precioBase: number;
  unidad: string;
  activo: boolean;
  slug: string;
}

export default function GestionServiciosPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Servicio | null>(null);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    icono: '🔧',
    precioBase: 0,
    unidad: 'servicio',
    activo: true,
  });

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    try {
      const res = await fetch('/api/servicios-admin');
      const data = await res.json();
      setServicios(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirCrear = () => {
    setEditando(null);
    setForm({
      nombre: '',
      descripcion: '',
      icono: '🔧',
      precioBase: 0,
      unidad: 'servicio',
      activo: true,
    });
    setShowModal(true);
  };

  const abrirEditar = (servicio: Servicio) => {
    setEditando(servicio);
    setForm({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      icono: servicio.icono,
      precioBase: servicio.precioBase,
      unidad: servicio.unidad,
      activo: servicio.activo,
    });
    setShowModal(true);
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editando) {
        await fetch(`/api/servicios-admin/${editando.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        alert('✅ Servicio actualizado');
      } else {
        await fetch('/api/servicios-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        alert('✅ Servicio creado');
      }
      setShowModal(false);
      cargarServicios();
    } catch (error) {
      alert('❌ Error al guardar');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async (id: string, nombre: string) => {
  if (!confirm(`¿Eliminar "${nombre}"?`)) return;

  console.log('🗑️ Intentando eliminar:', { id, nombre }); // ← AGREGAR ESTA LÍNEA

  setLoading(true);
  try {
    const response = await fetch(`/api/servicios-admin/${id}`, { method: 'DELETE' }); // ← MODIFICAR
    const data = await response.json(); // ← AGREGAR
    console.log('📥 Respuesta del servidor:', data); // ← AGREGAR
    
    if (response.ok) {
      alert('✅ Servicio eliminado');
      cargarServicios();
    } else {
      alert('❌ Error: ' + data.error);
    }
  } catch (error) {
    console.error('❌ Error completo:', error); // ← MODIFICAR
    alert('❌ Error al eliminar');
  } finally {
    setLoading(false);
  }
};

  const activos = servicios.filter(s => s.activo).length;
  const precioPromedio = servicios.length > 0
  ? servicios.reduce((sum, s) => sum + Number(s.precioBase), 0) / servicios.length
  : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🔧 Gestión de Servicios</h1>
              <p className="text-gray-600 mt-1">Administra el catálogo de servicios</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={abrirCrear}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
              >
                ➕ Nuevo Servicio
              </button>
              <Link
                href="/dashboard"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                ← Volver
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Total servicios</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{servicios.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Servicios activos</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{activos}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Precio promedio</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">
              {formatearMoneda(precioPromedio)}
            </div>
          </div>
        </div>

        {/* Tabla */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {servicios.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No hay servicios. <button onClick={abrirCrear} className="text-blue-600 underline font-semibold">Crea el primero</button>
                    </td>
                  </tr>
                ) : (
                  servicios.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{s.icono}</span>
                          <div>
                            <div className="font-semibold text-gray-900">{s.nombre}</div>
                            <div className="text-sm text-gray-500 max-w-md">
                              {s.descripcion.length > 60 ? s.descripcion.substring(0, 60) + '...' : s.descripcion}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {formatearMoneda(s.precioBase)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                          {s.unidad}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {s.activo ? '✅ Activo' : '❌ Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => abrirEditar(s)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => eliminar(s.id, s.nombre)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              {editando ? '✏️ Editar Servicio' : '➕ Nuevo Servicio'}
            </h2>
            <form onSubmit={guardar}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Servicio *
                </label>
                <input
                  type="text"
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Plomería"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Icono (Emoji) *
                </label>
                <input
                  type="text"
                  required
                  value={form.icono}
                  onChange={(e) => setForm({ ...form, icono: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-3xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="🔧"
                  maxLength={2}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Busca emojis en: <a href="https://emojipedia.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">emojipedia.org</a>
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  required
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe el servicio en detalle..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Precio Base *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={form.precioBase}
                    onChange={(e) => setForm({ ...form, precioBase: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Unidad *
                  </label>
                  <select
                    value={form.unidad}
                    onChange={(e) => setForm({ ...form, unidad: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="servicio">Servicio</option>
                    <option value="hora">Hora</option>
                    <option value="visita">Visita</option>
                    <option value="m2">m²</option>
                    <option value="punto">Punto</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.activo}
                    onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Servicio activo (visible para clientes)
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-3 rounded-lg font-semibold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}