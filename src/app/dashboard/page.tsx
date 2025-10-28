import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  // Obtener estadísticas
  const [
    totalLeads,
    totalCotizaciones,
    totalOrdenes,
    totalServicios,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.quote.count(),
    prisma.order.count(),
    prisma.service.count({
      where: { activo: true }
    }),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🏠 Dashboard - Servicios Rápidos EC
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Bienvenido de nuevo, Rafael
              </p>
            </div>
            <div className="text-sm text-gray-500">
              User ID: {userId.substring(0, 20)}...
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Leads */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Leads</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalLeads}</p>
              </div>
              <div className="text-4xl">📬</div>
            </div>
            <Link href="/dashboard/leads" className="text-sm text-blue-600 hover:underline mt-4 inline-block">
              Ver todos →
            </Link>
          </div>

          {/* Cotizaciones */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Cotizaciones</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalCotizaciones}</p>
              </div>
              <div className="text-4xl">📋</div>
            </div>
            <Link href="/dashboard/cotizaciones" className="text-sm text-yellow-600 hover:underline mt-4 inline-block">
              Ver todas →
            </Link>
          </div>

          {/* Órdenes */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Órdenes Activas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalOrdenes}</p>
              </div>
              <div className="text-4xl">⚙️</div>
            </div>
            <Link href="/dashboard/ordenes" className="text-sm text-green-600 hover:underline mt-4 inline-block">
              Ver todas →
            </Link>
          </div>

          {/* Servicios */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Servicios</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalServicios}</p>
              </div>
              <div className="text-4xl">🛠️</div>
            </div>
            <Link href="/dashboard/servicios" className="text-sm text-purple-600 hover:underline mt-4 inline-block">
              Gestionar →
            </Link>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🚀 Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild size="lg" className="w-full">
              <Link href="/dashboard/servicios">
                📋 Gestionar Servicios
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full">
              <Link href="/solicitar">
                📝 Nueva Solicitud (Vista Cliente)
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full">
              <Link href="/dashboard/test-ai">
                🤖 Probar IA
              </Link>
            </Button>
          </div>
        </div>

        {/* Próximamente */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">💡 Próximas funcionalidades</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✅ Gestión de servicios - <span className="text-green-600 font-semibold">Completado</span></li>
            <li>🔄 Sistema de cotizaciones con IA</li>
            <li>🔄 Gestión de órdenes de trabajo</li>
            <li>🔄 Panel de maestros</li>
            <li>🔄 Sistema de garantías</li>
            <li>🔄 Reportes y métricas</li>
          </ul>
        </div>
      </div>
    </div>
  )
}