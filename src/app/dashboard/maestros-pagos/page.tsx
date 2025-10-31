import { prisma } from '@/lib/prisma'
import { formatearFecha, formatearMoneda } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import RegistrarPagoMaestroButton from './RegistrarPagoMaestroButton'

export default async function MaestrosPagosPage() {
  // Obtener todos los maestros con sus órdenes
  const maestros = await prisma.user.findMany({
    where: {
      rol: 'MAESTRO',
      activo: true,
    },
    include: {
      ordenesAsignadas: {
        where: {
          estado: 'CERRADA',
        },
      },
      pagos: true, // Relación correcta: User tiene "pagos: MaestroPago[]"
    },
    orderBy: {
      nombre: 'asc',
    },
  })

  // Calcular deudas
  const maestrosConDeuda = maestros.map((maestro) => {
    const totalGanado = maestro.ordenesAsignadas.reduce(
      (sum, orden) => sum + Number(orden.costoMaestro),
      0
    )

    const totalPagado = maestro.pagos.reduce(
      (sum, pago) => sum + Number(pago.monto),
      0
    )

    const pendiente = totalGanado - totalPagado

    return {
      ...maestro,
      totalGanado,
      totalPagado,
      pendiente,
    }
  })

  const totalDeudaGeneral = maestrosConDeuda.reduce(
    (sum, m) => sum + m.pendiente,
    0
  )

  const maestrosConPendiente = maestrosConDeuda.filter((m) => m.pendiente > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pagos a Maestros</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestiona los pagos pendientes a tus maestros
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard">← Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Total Adeudado</div>
            <div className="text-3xl font-bold text-red-600 mt-2">
              {formatearMoneda(totalDeudaGeneral)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Maestros con Pendiente</div>
            <div className="text-3xl font-bold text-orange-600 mt-2">
              {maestrosConPendiente.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Total Maestros</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {maestros.length}
            </div>
          </div>
        </div>

        {/* TABLA DE MAESTROS */}
        {maestrosConDeuda.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-4xl mb-4">👷</div>
            <p className="text-gray-500">No hay maestros activos</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Maestro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Trabajos Completados
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Ganado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Pagado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Pendiente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {maestrosConDeuda.map((maestro) => (
                  <tr key={maestro.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {maestro.nombre}
                      </div>
                      <div className="text-sm text-gray-500">{maestro.telefono}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {maestro.ordenesAsignadas.length}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">
                        {formatearMoneda(maestro.totalGanado)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-blue-600">
                        {formatearMoneda(maestro.totalPagado)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-bold ${
                          maestro.pendiente > 0 ? 'text-red-600' : 'text-gray-400'
                        }`}
                      >
                        {formatearMoneda(maestro.pendiente)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        {maestro.pendiente > 0 && (
                          <RegistrarPagoMaestroButton
                            maestro={{
                              id: maestro.id,
                              nombre: maestro.nombre,
                            }}
                            pendiente={maestro.pendiente}
                          />
                        )}
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/dashboard/maestros/${maestro.id}`}>
                            Ver Perfil
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}