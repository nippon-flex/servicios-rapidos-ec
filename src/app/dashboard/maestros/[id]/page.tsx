import { prisma } from '@/lib/prisma'
import { formatearFecha, formatearMoneda } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function MaestroDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const maestro = await prisma.user.findUnique({
    where: { id },
    include: {
      ordenesAsignadas: {
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
          pagos: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!maestro) {
    notFound()
  }

  const totalOrdenesAsignadas = maestro.ordenesAsignadas.length
  const ordenesActivas = maestro.ordenesAsignadas.filter(
    (o) => !['CERRADA', 'CANCELADA'].includes(o.estado)
  ).length
  const ordenesCompletadas = maestro.ordenesAsignadas.filter(
    (o) => o.estado === 'CERRADA'
  ).length

  const totalGanado = maestro.ordenesAsignadas
    .filter((o) => o.estado === 'CERRADA')
    .reduce((sum, o) => sum + Number(o.costoMaestro), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{maestro.nombre}</h1>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    maestro.activo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {maestro.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">Maestro de Servicios Rápidos EC</p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link href="/dashboard/maestros">← Volver</Link>
              </Button>
              <Button asChild>
                <Link href={`/dashboard/maestros/${maestro.id}/editar`}>Editar</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMNA PRINCIPAL */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* INFORMACIÓN PERSONAL */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Información Personal
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Teléfono</label>
                  <p className="text-base text-gray-900">{maestro.telefono}</p>
                </div>
                {maestro.ci && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Cédula</label>
                    <p className="text-base text-gray-900">{maestro.ci}</p>
                  </div>
                )}
                {maestro.especialidades && maestro.especialidades.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-2">
                      Especialidades
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {maestro.especialidades.map((esp, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                        >
                          {esp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {maestro.cuentaBanco && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Cuenta Bancaria
                    </label>
                    <p className="text-base text-gray-900">{maestro.cuentaBanco}</p>
                  </div>
                )}
              </div>
            </div>

            {/* HISTORIAL DE ÓRDENES */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Órdenes Asignadas
              </h2>
              
              {maestro.ordenesAsignadas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📋</div>
                  <p>No hay órdenes asignadas</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Las órdenes aparecerán aquí cuando las asignes
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {maestro.ordenesAsignadas.map((orden) => {
                    const totalPagado = orden.pagos.reduce(
                      (sum, p) => sum + Number(p.monto),
                      0
                    )
                    const pendientePago = Number(orden.quote.total) - totalPagado

                    return (
                      <div
                        key={orden.id}
                        className="border rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Link
                                  href={`/dashboard/ordenes/${orden.id}`}
                                  className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                                >
                                  {orden.codigo}
                                </Link>
                                <span
                                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    orden.estado === 'CERRADA'
                                      ? 'bg-green-100 text-green-800'
                                      : orden.estado === 'ANTICIPO_PENDIENTE'
                                      ? 'bg-orange-100 text-orange-800'
                                      : orden.estado === 'ANTICIPO_PAGADO'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {orden.estado.replace(/_/g, ' ')}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                Cliente: {orden.quote.lead.clienteNombre}
                              </div>
                              <div className="text-sm text-gray-500">
                                {orden.quote.lead.service.icono} {orden.quote.lead.service.nombre}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {formatearFecha(orden.createdAt)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500">Tu pago</div>
                              <div className="text-xl font-bold text-green-600">
                                {formatearMoneda(Number(orden.costoMaestro))}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                            <div>
                              <div className="text-xs text-gray-500">Total Orden</div>
                              <div className="text-sm font-semibold text-gray-900">
                                {formatearMoneda(Number(orden.quote.total))}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Cliente Pagó</div>
                              <div className="text-sm font-semibold text-blue-600">
                                {formatearMoneda(totalPagado)}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Pendiente</div>
                              <div className="text-sm font-semibold text-orange-600">
                                {formatearMoneda(pendientePago)}
                              </div>
                            </div>
                          </div>

                          {orden.estado === 'CERRADA' && (
                            <div className="mt-3 p-2 bg-green-50 rounded text-center">
                              <span className="text-xs font-medium text-green-800">
                                ✅ Trabajo Completado y Pagado
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA LATERAL */}
          <div className="space-y-6">
            
            {/* ESTADÍSTICAS */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Estadísticas
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Órdenes</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {totalOrdenesAsignadas}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Activas</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {ordenesActivas}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completadas</span>
                  <span className="text-2xl font-bold text-green-600">
                    {ordenesCompletadas}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="text-sm text-gray-600 mb-1">Total Ganado</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatearMoneda(totalGanado)}
                  </div>
                </div>
              </div>
            </div>

            {/* ACCIONES */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Acciones
              </h3>
              <div className="space-y-3">
                <a
                  href={`https://wa.me/${maestro.telefono.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hola ${maestro.nombre}, te contacto sobre las órdenes de trabajo...`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    📱 Contactar por WhatsApp
                  </Button>
                </a>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/dashboard/maestros/${maestro.id}/editar`}>
                    ✏️ Editar Información
                  </Link>
                </Button>
              </div>
            </div>

            {/* INFO ADICIONAL */}
            <div className="bg-gray-50 rounded-lg border p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                ℹ️ Información
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Rol:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {maestro.rol}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Registrado:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {formatearFecha(maestro.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}