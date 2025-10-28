import { prisma } from '@/lib/prisma'
import { formatearFecha } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function LeadsPage() {
  // Obtener TODOS los leads de la base de datos, ordenados por fecha (más recientes primero)
  const leads = await prisma.lead.findMany({
    include: {
      service: true, // Incluir información del servicio
      region: true,  // Incluir información de la región
    },
    orderBy: {
      createdAt: 'desc', // desc = descendente (más nuevos primero)
    },
  })

  // Contar cuántos hay por estado
  const stats = {
    total: leads.length,
    nuevos: leads.filter(l => l.estado === 'NUEVO').length,
    urgentes: leads.filter(l => l.urgente).length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER - Parte superior con título */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📬 Solicitudes de Clientes (Leads)
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestiona las solicitudes recibidas desde el formulario web
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard">← Volver al Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TARJETAS DE ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="text-sm text-gray-500">Total de solicitudes</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</div>
          </div>

          {/* Nuevos */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="text-sm text-gray-500">Nuevos (sin atender)</div>
            <div className="text-3xl font-bold text-green-600 mt-2">{stats.nuevos}</div>
          </div>

          {/* Urgentes */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="text-sm text-gray-500">Urgentes 🚨</div>
            <div className="text-3xl font-bold text-red-600 mt-2">{stats.urgentes}</div>
          </div>
        </div>

        {/* TABLA DE LEADS */}
        {leads.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              {/* CABECERA DE LA TABLA */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Código / Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>

              {/* CUERPO DE LA TABLA - aquí se muestran los leads */}
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    {/* COLUMNA 1: Código y Cliente */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {lead.codigo}
                      </div>
                      <div className="text-sm text-gray-600">{lead.clienteNombre}</div>
                      <div className="text-xs text-gray-500">{lead.clienteTelefono}</div>
                    </td>

                    {/* COLUMNA 2: Servicio */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{lead.service.icono}</span>
                        <span className="text-sm font-medium">{lead.service.nombre}</span>
                      </div>
                    </td>

                    {/* COLUMNA 3: Descripción */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-xs">
                        {lead.descripcion.substring(0, 80)}
                        {lead.descripcion.length > 80 && '...'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        📍 {lead.direccion}
                      </div>
                    </td>

                    {/* COLUMNA 4: Fecha */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatearFecha(lead.createdAt)}
                      </div>
                    </td>

                    {/* COLUMNA 5: Estado */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {/* Badge de estado */}
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          lead.estado === 'NUEVO' ? 'bg-green-100 text-green-800' :
                          lead.estado === 'CONTACTADO' ? 'bg-blue-100 text-blue-800' :
                          lead.estado === 'COTIZANDO' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.estado}
                        </span>
                        
                        {/* Badge de urgente */}
                        {lead.urgente && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            🚨 URGENTE
                          </span>
                        )}
                      </div>
                    </td>

                    {/* COLUMNA 6: Acciones */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col gap-2">
                        {/* Botón WhatsApp */}
                        <a
                          href={`https://wa.me/${lead.clienteTelefono.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${lead.clienteNombre}, te contacto sobre tu solicitud ${lead.codigo}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900 font-medium"
                        >
                          📱 WhatsApp
                        </a>
                        
                        {/* Botón Crear Cotización (próximamente) */}
                        <button className="text-blue-600 hover:text-blue-900 font-medium text-left">
                          📋 Cotizar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // MENSAJE SI NO HAY LEADS
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay solicitudes aún
            </h3>
            <p className="text-gray-500 mb-4">
              Cuando los clientes envíen solicitudes desde el formulario, aparecerán aquí
            </p>
            <Button asChild>
              <Link href="/solicitar">
                Ir al formulario de prueba
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}