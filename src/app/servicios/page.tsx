import { prisma } from '@/lib/prisma'
import { formatearMoneda } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function ServiciosPage() {
  // Obtener la región de Quito
  const region = await prisma.region.findFirst({
    where: {
      ciudad: 'Quito',
      pais: 'Ecuador',
    },
  })

  if (!region) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">
          Error: No se encontró la región de Quito
        </h1>
        <p className="mt-2 text-gray-600">
          Asegúrate de haber ejecutado el seed: <code>npm run seed</code>
        </p>
      </div>
    )
  }

  // Obtener todos los servicios
  const servicios = await prisma.service.findMany({
    where: {
      regionId: region.id,
    },
    orderBy: {
      orden: 'asc',
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📋 Servicios - Quito
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestiona el catálogo de servicios disponibles
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard">← Volver al Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Total de servicios</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {servicios.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Servicios activos</div>
            <div className="text-3xl font-bold text-green-600 mt-2">
              {servicios.filter(s => s.activo).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Precio promedio</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">
              {formatearMoneda(
                servicios.reduce((sum, s) => sum + Number(s.precioBase), 0) / servicios.length
              )}
            </div>
          </div>
        </div>

        {/* Tabla de servicios */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {servicios.map((servicio) => (
                <tr key={servicio.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{servicio.icono}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {servicio.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {servicio.descripcion.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatearMoneda(servicio.precioBase)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {servicio.unidad}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {servicio.activo ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Activo
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      Editar
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {servicios.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">No hay servicios registrados</p>
            <Button className="mt-4">+ Agregar primer servicio</Button>
          </div>
        )}
      </div>
    </div>
  )
}