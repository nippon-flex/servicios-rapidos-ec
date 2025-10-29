import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatearMoneda, formatearFecha } from '@/lib/utils'

export default async function CotizacionesPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const cotizaciones = await prisma.quote.findMany({
    include: {
      lead: {
        include: {
          service: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const stats = {
    total: cotizaciones.length,
    borradores: cotizaciones.filter((c) => c.estado === 'BORRADOR').length,
    enviadas: cotizaciones.filter((c) => c.estado === 'ENVIADA').length,
    aprobadas: cotizaciones.filter((c) => c.estado === 'APROBADA').length,
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border">
            <p className="text-gray-600 text-sm">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-gray-600 text-sm">Borradores</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.borradores}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-gray-600 text-sm">Enviadas</p>
            <p className="text-2xl font-bold text-blue-700">{stats.enviadas}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-gray-600 text-sm">Aprobadas</p>
            <p className="text-2xl font-bold text-green-700">{stats.aprobadas}</p>
          </div>
        </div>

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
              {cotizaciones.map((cot) => (
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
                    {formatearMoneda(Number(cot.total))}
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
                    {formatearFecha(cot.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link href={`/dashboard/cotizaciones/${cot.id}`}>
                      <Button size="sm">Ver detalles →</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {cotizaciones.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No hay cotizaciones registradas
            </div>
          )}
        </div>
      </div>
    </div>
  )
}