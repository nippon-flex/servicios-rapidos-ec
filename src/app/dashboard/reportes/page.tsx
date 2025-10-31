'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Reporte = {
  periodo: string;
  fechaInicio: string;
  estadisticas: {
    totalLeads: number;
    totalOrdenes: number;
    ordenesCompletadas: number;
    tasaConversion: string;
  };
  serviciosMasSolicitados: Array<{
    nombre: string;
    icono: string;
    count: number;
  }>;
  maestrosMasProductivos: Array<{
    nombre: string;
    ordenes: number;
    completadas: number;
  }>;
  tiempoPromedioCierre: {
    dias: number;
    horas: number;
    texto: string;
  };
  zonasMasDemanda: Array<{
    ciudad: string;
    pais: string;
    count: number;
  }>;
};

export default function ReportesPage() {
  const [periodo, setPeriodo] = useState('mes');
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarReporte();
  }, [periodo]);

  const cargarReporte = async () => {
    setCargando(true);
    try {
      const res = await fetch(`/api/reportes?periodo=${periodo}`);
      const data = await res.json();
      setReporte(data);
    } catch (error) {
      console.error('Error cargando reporte:', error);
    } finally {
      setCargando(false);
    }
  };

  const periodos = [
    { value: 'hoy', label: '📅 Hoy' },
    { value: 'semana', label: '📅 Esta Semana' },
    { value: 'mes', label: '📅 Este Mes' },
    { value: 'año', label: '📅 Este Año' },
    { value: 'todo', label: '📅 Todo el Tiempo' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📊 Reportes y Métricas</h1>
              <p className="text-sm text-gray-500 mt-1">
                Análisis operativo del negocio
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard">← Volver</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">🔍 Período de Análisis</h3>
          <div className="flex flex-wrap gap-3">
            {periodos.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriodo(p.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  periodo === p.value
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENIDO */}
        {cargando ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">⏳</div>
            <p className="text-gray-500">Generando reporte...</p>
          </div>
        ) : !reporte ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">❌</div>
            <p className="text-gray-500">Error al cargar reporte</p>
          </div>
        ) : (
          <>
            {/* ESTADÍSTICAS GENERALES */}
{reporte && (
  <>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-3xl mb-2">📋</div>
        <div className="text-2xl font-bold text-gray-900">
          {reporte.estadisticas.totalLeads}
        </div>
        <div className="text-sm text-gray-500">Total Leads</div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-3xl mb-2">📦</div>
        <div className="text-2xl font-bold text-gray-900">
          {reporte.estadisticas.totalOrdenes}
        </div>
        <div className="text-sm text-gray-500">Órdenes Creadas</div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-3xl mb-2">✅</div>
        <div className="text-2xl font-bold text-green-600">
          {reporte.estadisticas.ordenesCompletadas}
        </div>
        <div className="text-sm text-gray-500">Órdenes Completadas</div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-3xl mb-2">📈</div>
        <div className="text-2xl font-bold text-blue-600">
          {reporte.estadisticas.tasaConversion}
        </div>
        <div className="text-sm text-gray-500">Tasa de Conversión</div>
      </div>
    </div>

    {/* GRID DE MÉTRICAS */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* SERVICIOS MÁS SOLICITADOS */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">📋 Servicios Más Solicitados</h3>
        {reporte.serviciosMasSolicitados.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Sin datos</p>
        ) : (
          <div className="space-y-3">
            {reporte.serviciosMasSolicitados.map((servicio, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{servicio.icono}</div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {servicio.nombre}
                    </div>
                    <div className="text-xs text-gray-500">
                      Top {idx + 1}
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold text-blue-600">
                  {servicio.count}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MAESTROS MÁS PRODUCTIVOS */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">👷 Maestros Más Productivos</h3>
        {reporte.maestrosMasProductivos.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Sin datos</p>
        ) : (
          <div className="space-y-3">
            {reporte.maestrosMasProductivos.map((maestro, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {maestro.nombre}
                  </div>
                  <div className="text-xs text-gray-500">
                    {maestro.ordenes} órdenes asignadas
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-600">
                    {maestro.completadas}
                  </div>
                  <div className="text-xs text-gray-500">completadas</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TIEMPO PROMEDIO DE CIERRE */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">⏱️ Tiempo Promedio de Cierre</h3>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">⏳</div>
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {reporte.tiempoPromedioCierre.dias}
            <span className="text-2xl text-gray-500 ml-2">días</span>
          </div>
          <div className="text-xl text-gray-600">
            {reporte.tiempoPromedioCierre.horas} horas
          </div>
          <div className="text-sm text-gray-500 mt-4">
            Desde creación hasta cierre
          </div>
        </div>
      </div>

      {/* ZONAS CON MÁS DEMANDA */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">📍 Zonas con Más Demanda</h3>
        {reporte.zonasMasDemanda.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Sin datos</p>
        ) : (
          <div className="space-y-3">
            {reporte.zonasMasDemanda.map((zona, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📍</div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {zona.ciudad}
                    </div>
                    <div className="text-xs text-gray-500">{zona.pais}</div>
                  </div>
                </div>
                <div className="text-xl font-bold text-purple-600">
                  {zona.count}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </>
)}

            {/* GRID DE MÉTRICAS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SERVICIOS MÁS SOLICITADOS */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">📋 Servicios Más Solicitados</h3>
                {reporte.serviciosMasSolicitados.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Sin datos</p>
                ) : (
                  <div className="space-y-3">
                    {reporte.serviciosMasSolicitados.map((servicio, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{servicio.icono}</div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {servicio.nombre}
                            </div>
                            <div className="text-xs text-gray-500">
                              Top {idx + 1}
                            </div>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-blue-600">
                          {servicio.count}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* MAESTROS MÁS PRODUCTIVOS */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">👷 Maestros Más Productivos</h3>
                {reporte.maestrosMasProductivos.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Sin datos</p>
                ) : (
                  <div className="space-y-3">
                    {reporte.maestrosMasProductivos.map((maestro, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {maestro.nombre}
                          </div>
                          <div className="text-xs text-gray-500">
                            {maestro.ordenes} órdenes asignadas
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">
                            {maestro.completadas}
                          </div>
                          <div className="text-xs text-gray-500">completadas</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* TIEMPO PROMEDIO DE CIERRE */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">⏱️ Tiempo Promedio de Cierre</h3>
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">⏳</div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {reporte.tiempoPromedioCierre.dias}
                    <span className="text-2xl text-gray-500 ml-2">días</span>
                  </div>
                  <div className="text-xl text-gray-600">
                    {reporte.tiempoPromedioCierre.horas} horas
                  </div>
                  <div className="text-sm text-gray-500 mt-4">
                    Desde creación hasta cierre
                  </div>
                </div>
              </div>

              {/* ZONAS CON MÁS DEMANDA */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">📍 Zonas con Más Demanda</h3>
                {reporte.zonasMasDemanda.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Sin datos</p>
                ) : (
                  <div className="space-y-3">
                    {reporte.zonasMasDemanda.map((zona, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">📍</div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {zona.ciudad}
                            </div>
                            <div className="text-xs text-gray-500">{zona.pais}</div>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-purple-600">
                          {zona.count}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}