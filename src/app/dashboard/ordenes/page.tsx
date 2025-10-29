import { prisma } from '@/lib/prisma'
import { formatearFecha, formatearMoneda } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function OrdenesPage() {
  const ordenes = await prisma.order.findMany({
    include: {
      quote: {
        include: {
          lead: {
            include: {
              service: true,
            },
          },
        },
      },
      maestro: true,
      pagos: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Calcular estadísticas
  const totalOrdenes = ordenes.length
  const anticiposPendientes = ordenes.filter((o) => o.estado === 'ANTICIPO_PENDIENTE').length
  const enEjecucion = ordenes.filter((o) => 
    ['ANTICIPO_PAGADO', 'AGENDADA', 'EN_CAMINO', 'EN_EJECUCION'].includes(o.estado)
  ).length
  const cerradas = ordenes.filter((o) => o.estado === 'CERRADA').length

  // Calcular ingresos
  const totalIngresos = ordenes
    .filter((o) => o.estado === 'CERRADA')
    .reduce((sum, o) => sum + Number(o.quote.total), 0)

  const totalMargenes = ordenes
    .filter((o) => o.estado === 'CERRADA')
    .reduce((sum, o) => sum + Number(o.margen), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📋 Órdenes de Trabajo</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestiona todas las órdenes y pagos
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard">← Volver al Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Total Órdenes</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{totalOrdenes}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Anticipo Pendiente</div>
            <div className="text-3xl font-bold text-orange-600 mt-2">{anticiposPendientes}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">En Ejecución</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">{enEjecucion}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Cerradas</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{cerradas}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Ingresos Total</div>
            <div className="text-2xl font-bold text-green-600 mt-2">
              {formatearMoneda(totalIngresos)}
            </div>
          </div>
        </div>

        {/* TABLA DE ÓRDENES */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cliente / Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Margen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ordenes.map((orden) => (
                <tr key={orden.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/dashboard/ordenes/${orden.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {orden.codigo}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {orden.quote.lead.clienteNombre}
                    </div>
                    <div className="text-sm text-gray-500">
                      {orden.quote.lead.service.icono} {orden.quote.lead.service.nombre}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatearMoneda(Number(orden.quote.total))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      {formatearMoneda(Number(orden.margen))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        orden.estado === 'ANTICIPO_PENDIENTE'
                          ? 'bg-orange-100 text-orange-800'
                          : orden.estado === 'ANTICIPO_PAGADO'
                          ? 'bg-blue-100 text-blue-800'
                          : orden.estado === 'CERRADA'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {orden.estado.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatearFecha(orden.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/ordenes/${orden.id}`}>Ver Detalle</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {ordenes.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-gray-500">No hay órdenes registradas aún</p>
            <p className="text-sm text-gray-400 mt-2">
              Las órdenes se crean automáticamente cuando apruebas una cotización
            </p>
          </div>
        )}
      </div>
    </div>
  )
}