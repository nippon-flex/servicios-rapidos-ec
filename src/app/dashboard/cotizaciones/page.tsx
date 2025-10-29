'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Cotizacion = {
  id: string
  codigo: string
  total: number
  estado: string
  createdAt: string
  lead: {
    clienteNombre: string
    service: {
      nombre: string
    }
  }
}

type FiltroEstado = 'TODAS' | 'BORRADOR' | 'ENVIADA' | 'APROBADA' | 'CONVERTIDA'

export default function CotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [filtro, setFiltro] = useState<FiltroEstado>('TODAS')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cotizaciones')
      .then(res => res.json())
      .then(data => {
        setCotizaciones(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error:', error)
        setLoading(false)
      })
  }, [])

  const total = cotizaciones.length
  const borradores = cotizaciones.filter(c => c.estado === 'BORRADOR').length
  const enviadas = cotizaciones.filter(c => c.estado === 'ENVIADA').length
  const aprobadas = cotizaciones.filter(c => c.estado === 'APROBADA').length

  const cotizacionesFiltradas = filtro === 'TODAS' 
    ? cotizaciones 
    : cotizaciones.filter(c => c.estado === filtro)

  const aplicarFiltro = (nuevoFiltro: FiltroEstado) => {
    setFiltro(nuevoFiltro)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-gray-600">Cargando cotizaciones...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">📋 Cotizaciones</h1>
          <Link href="/dashboard">
            <Button variant="outline">← Volver al Dashboard</Button>
          </Link>
        </div>

        {/* Estadísticas - AHORA SON CLICKEABLES */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => aplicarFiltro('TODAS')}
            className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
              filtro === 'TODAS' 
                ? 'bg-blue-50 border-blue-500 shadow-md' 
                : 'bg-white border-gray-200 hover:border-blue-300'
            }`}
          >
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-3xl font-bold text-gray-900">{total}</p>
          </button>

          <button
            onClick={() => aplicarFiltro('BORRADOR')}
            className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
              filtro === 'BORRADOR' 
                ? 'bg-yellow-50 border-yellow-500 shadow-md' 
                : 'bg-white border-gray-200 hover:border-yellow-300'
            }`}
          >
            <p className="text-sm text-gray-600">Borradores</p>
            <p className="text-3xl font-bold text-gray-900">{borradores}</p>
          </button>

          <button
            onClick={() => aplicarFiltro('ENVIADA')}
            className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
              filtro === 'ENVIADA' 
                ? 'bg-blue-50 border-blue-500 shadow-md' 
                : 'bg-white border-gray-200 hover:border-blue-300'
            }`}
          >
            <p className="text-sm text-gray-600">Enviadas</p>
            <p className="text-3xl font-bold text-gray-900">{enviadas}</p>
          </button>

          <button
            onClick={() => aplicarFiltro('APROBADA')}
            className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
              filtro === 'APROBADA' 
                ? 'bg-green-50 border-green-500 shadow-md' 
                : 'bg-white border-gray-200 hover:border-green-300'
            }`}
          >
            <p className="text-sm text-gray-600">Aprobadas</p>
            <p className="text-3xl font-bold text-gray-900">{aprobadas}</p>
          </button>
        </div>

        {/* Indicador de filtro activo */}
        {filtro !== 'TODAS' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <p className="text-sm text-blue-800">
              📊 Mostrando: <strong>{filtro}</strong> ({cotizacionesFiltradas.length})
            </p>
            <button
              onClick={() => aplicarFiltro('TODAS')}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Ver todas
            </button>
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cotizacionesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    {filtro === 'TODAS' 
                      ? 'No hay cotizaciones registradas' 
                      : `No hay cotizaciones en estado ${filtro}`}
                  </td>
                </tr>
              ) : (
                cotizacionesFiltradas.map((cot) => (
                  <tr key={cot.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cot.codigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cot.lead.clienteNombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {cot.lead.service.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${Number(cot.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          cot.estado === 'APROBADA'
                            ? 'bg-green-100 text-green-800'
                            : cot.estado === 'ENVIADA'
                            ? 'bg-blue-100 text-blue-800'
                            : cot.estado === 'BORRADOR'
                            ? 'bg-yellow-100 text-yellow-800'
                            : cot.estado === 'CONVERTIDA'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {cot.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(cot.createdAt).toLocaleDateString('es-EC', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link href={`/dashboard/cotizaciones/${cot.id}`}>
                        <Button size="sm">Ver detalles →</Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}