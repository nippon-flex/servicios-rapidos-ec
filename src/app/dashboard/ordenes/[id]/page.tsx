import { prisma } from '@/lib/prisma'
import { formatearFecha, formatearMoneda } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import RegistrarPagoButton from './RegistrarPagoButton'
import AsignarMaestroButton from './AsignarMaestroButton'

export default async function OrdenDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const orden = await prisma.order.findUnique({
    where: { id },
    include: {
      quote: {
        include: {
          lead: {
            include: {
              service: true,
            },
          },
          items: true,
        },
      },
      maestro: true,
      pagos: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      region: true,
    },
  })

  if (!orden) {
    notFound()
  }

  // Calcular totales de pagos
  const totalPagado = orden.pagos.reduce((sum, p) => sum + Number(p.monto), 0)
  const totalOrden = Number(orden.quote.total)
  const anticipo = Number(orden.quote.anticipo)
  const saldo = Number(orden.quote.saldo)
  const pendiente = totalOrden - totalPagado

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{orden.codigo}</h1>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    orden.estado === 'ANTICIPO_PENDIENTE'
                      ? 'bg-orange-100 text-orange-700'
                      : orden.estado === 'ANTICIPO_PAGADO'
                      ? 'bg-blue-100 text-blue-700'
                      : orden.estado === 'CERRADA'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {orden.estado.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Cliente: {orden.quote.lead.clienteNombre} - {orden.quote.lead.service.nombre}
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard/ordenes">← Volver a Órdenes</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMNA PRINCIPAL */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* DATOS DEL CLIENTE */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">👤 Cliente</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Nombre:</span>
                  <span className="font-medium text-gray-900">
                    {orden.quote.lead.clienteNombre}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Teléfono:</span>
                  <span className="font-medium text-gray-900">
                    {orden.quote.lead.clienteTelefono}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dirección:</span>
                  <span className="font-medium text-gray-900">
                    {orden.quote.lead.direccion}
                  </span>
                </div>
              </div>
            </div>

            {/* ITEMS DE LA COTIZACIÓN */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Items del Trabajo</h2>
              <div className="space-y-3">
                {orden.quote.items.map((item, idx) => (
                  <div key={item.id} className="flex justify-between border-b pb-3">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {idx + 1}. {item.descripcion}
                      </p>
                      <p className="text-sm text-gray-500">
                        {Number(item.cantidad)} × {formatearMoneda(Number(item.precioUnitario))}
                      </p>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {formatearMoneda(Number(item.total))}
                    </div>
                  </div>
                ))}
              </div>

              {/* TOTALES */}
              <div className="mt-6 space-y-2 border-t pt-4">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    {formatearMoneda(Number(orden.quote.subtotal))}
                  </span>
                </div>
                {Number(orden.quote.impuesto) > 0 && (
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">IVA:</span>
                    <span className="font-semibold text-gray-900">
                      {formatearMoneda(Number(orden.quote.impuesto))}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span className="text-gray-900">TOTAL:</span>
                  <span className="text-blue-600">{formatearMoneda(totalOrden)}</span>
                </div>
              </div>
            </div>

            {/* HISTORIAL DE PAGOS */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">💳 Historial de Pagos</h2>
              
              {orden.pagos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">💰</div>
                  <p>No hay pagos registrados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orden.pagos.map((pago) => (
                    <div
                      key={pago.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded ${
                              pago.tipo === 'ANTICIPO'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {pago.tipo}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatearFecha(pago.fecha)}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          Método: {pago.metodo}
                          {pago.referencia && ` - Ref: ${pago.referencia}`}
                        </div>
                      </div>
                      <div className="text-xl font-bold text-green-600">
                        {formatearMoneda(Number(pago.monto))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA LATERAL */}
          <div className="space-y-6">
            
            {/* RESUMEN FINANCIERO */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Resumen</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Orden:</span>
                  <span className="font-semibold text-gray-900">
                    {formatearMoneda(totalOrden)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Anticipo (30%):</span>
                  <span className="font-semibold text-blue-600">
                    {formatearMoneda(anticipo)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Saldo (70%):</span>
                  <span className="font-semibold text-orange-600">
                    {formatearMoneda(saldo)}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total Pagado:</span>
                  <span className="font-bold text-green-600">
                    {formatearMoneda(totalPagado)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Pendiente:</span>
                  <span className="font-bold text-red-600">
                    {formatearMoneda(pendiente)}
                  </span>
                </div>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Acciones</h3>
              
              <div className="space-y-3">
                {/* Asignar Maestro */}
<AsignarMaestroButton
  ordenId={orden.id}
  maestroActual={orden.maestro}
/>
                {/* Botón Registrar Anticipo */}
                {orden.estado === 'ANTICIPO_PENDIENTE' && (
                  <RegistrarPagoButton
                    ordenId={orden.id}
                    tipo="ANTICIPO"
                    montoSugerido={anticipo}
                  />
                )}

                {/* Botón Registrar Saldo */}
                {orden.estado === 'ANTICIPO_PAGADO' && (
                  <RegistrarPagoButton
                    ordenId={orden.id}
                    tipo="SALDO"
                    montoSugerido={saldo}
                  />
                )}

                {/* Info si está cerrada */}
                {orden.estado === 'CERRADA' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <div className="text-2xl mb-2">✅</div>
                    <p className="text-sm font-semibold text-green-800">
                      Orden Completada y Pagada
                    </p>
                  </div>
                )}

                {/* Botón WhatsApp */}
                <a
                  href={`https://wa.me/${orden.quote.lead.clienteTelefono.replace(
                    /[^0-9]/g,
                    ''
                  )}?text=${encodeURIComponent(
                    `Hola ${orden.quote.lead.clienteNombre}, sobre la orden ${orden.codigo}...`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    📱 Contactar por WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            {/* INFO ADICIONAL */}
            <div className="bg-gray-50 rounded-lg border p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">ℹ️ Información</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Costo Maestro:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {formatearMoneda(Number(orden.costoMaestro))}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Margen:</span>
                  <span className={`ml-2 font-medium ${Number(orden.margen) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatearMoneda(Number(orden.margen))}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Creada:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {formatearFecha(orden.createdAt)}
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