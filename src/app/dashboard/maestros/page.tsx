import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function MaestrosPage() {
  const maestros = await prisma.user.findMany({
    where: { rol: 'MAESTRO' },
    include: { ordenesAsignadas: true },
    orderBy: { nombre: 'asc' },
  })

  const activos = maestros.filter((m) => m.activo).length
  const inactivos = maestros.filter((m) => !m.activo).length
  const totalOrdenes = maestros.reduce((sum, m) => sum + m.ordenesAsignadas.length, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER - MISMO ESTILO */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Maestros</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestiona tu equipo de trabajo
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link href="/dashboard">← Volver al Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard/maestros/nuevo">+ Nuevo Maestro</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ESTADÍSTICAS - MISMO ESTILO QUE ÓRDENES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Total Maestros</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{maestros.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Activos</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{activos}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Inactivos</div>
            <div className="text-3xl font-bold text-orange-600 mt-2">{inactivos}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Total Órdenes</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">{totalOrdenes}</div>
          </div>
        </div>

        {/* TABLA - MISMO ESTILO QUE ÓRDENES */}
        {maestros.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-4xl mb-4">👷</div>
            <p className="text-gray-500">No hay maestros registrados</p>
            <p className="text-sm text-gray-400 mt-2">
              Comienza agregando tu primer maestro
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/maestros/nuevo">+ Agregar Primer Maestro</Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    CI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Especialidades
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Órdenes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {maestros.map((maestro) => (
                  <tr key={maestro.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {maestro.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{maestro.telefono}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{maestro.ci || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {maestro.especialidades && maestro.especialidades.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {maestro.especialidades.map((esp, idx) => (
                            <span
                              key={idx}
                              className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                            >
                              {esp}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {maestro.ordenesAsignadas.length}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          maestro.activo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {maestro.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/dashboard/maestros/${maestro.id}`}>Ver Detalle</Link>
                      </Button>
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