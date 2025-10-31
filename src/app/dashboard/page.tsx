import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
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
    totalGarantias,
    totalMaestros,
    totalPagosClientes,
    totalPagosMaestros,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.quote.count(),
    prisma.order.count(),
    prisma.service.count({
      where: { activo: true }
    }),
    prisma.warrantyCase.count(),
    prisma.user.count({
      where: { rol: 'MAESTRO' }
    }),
    prisma.payment.count(),
    prisma.maestroPago.count(),
  ])

  const totalPagos = totalPagosClientes + totalPagosMaestros

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

        {/* Segunda fila de tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Garantías */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Garantías</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalGarantias}</p>
              </div>
              <div className="text-4xl">🛡️</div>
            </div>
            <Link href="/dashboard/garantias" className="text-sm text-orange-600 hover:underline mt-4 inline-block">
              Gestionar →
            </Link>
          </div>

          {/* Maestros */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Maestros</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalMaestros}</p>
              </div>
              <div className="text-4xl">👷</div>
            </div>
            <Link href="/dashboard/maestros" className="text-sm text-indigo-600 hover:underline mt-4 inline-block">
              Gestionar →
            </Link>
          </div>

          {/* Pagos */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pagos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalPagos}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
            <Link href="/dashboard/pagos" className="text-sm text-emerald-600 hover:underline mt-4 inline-block">
              Ver todos →
            </Link>
          </div>

          {/* REPORTES */}
          <Link
            href="/dashboard/reportes"
            className="block bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 p-6 text-white border-l-4 border-pink-600"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/90">Reportes</p>
                <p className="text-3xl font-bold text-white mt-2">📊</p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
            <div className="text-sm text-white/90 mt-4 inline-block">
              Ver análisis →
            </div>
          </Link>
        </div>

        {/* Enlaces rápidos */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 Enlaces Rápidos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/solicitar"
              target="_blank"
              className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="text-3xl mb-2">📝</div>
              <div className="text-sm font-medium text-gray-900">Formulario Clientes</div>
            </a>
            <a
              href="/servicios"
              target="_blank"
              className="text-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="text-3xl mb-2">🛠️</div>
              <div className="text-sm font-medium text-gray-900">Catálogo Público</div>
            </a>
            <a
              href="/garantia"
              target="_blank"
              className="text-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <div className="text-3xl mb-2">🛡️</div>
              <div className="text-sm font-medium text-gray-900">Consultar Garantía</div>
            </a>
            <a
              href="/"
              target="_blank"
              className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="text-3xl mb-2">🏠</div>
              <div className="text-sm font-medium text-gray-900">Landing Page</div>
            </a>
          </div>
        </div>

        {/* Estado del Sistema */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">✅ Sistema Completo</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✅ Gestión de servicios - <span className="text-green-600 font-semibold">Completado</span></li>
            <li>✅ Sistema de cotizaciones con IA - <span className="text-green-600 font-semibold">Completado</span></li>
            <li>✅ Gestión de órdenes de trabajo - <span className="text-green-600 font-semibold">Completado</span></li>
            <li>✅ Panel de maestros - <span className="text-green-600 font-semibold">Completado</span></li>
            <li>✅ Sistema de garantías - <span className="text-green-600 font-semibold">Completado</span></li>
            <li>✅ Gestión de pagos - <span className="text-green-600 font-semibold">Completado</span></li>
            <li>✅ Reportes y métricas - <span className="text-green-600 font-semibold">Completado</span></li>
          </ul>
        </div>
      </div>
    </div>
  )
}