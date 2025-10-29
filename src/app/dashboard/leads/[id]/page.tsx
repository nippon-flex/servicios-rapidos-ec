import { prisma } from '@/lib/prisma'
import { formatearFecha, formatearMoneda } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Esta función recibe el ID del lead desde la URL
export default async function LeadDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Esperar los params (nuevo en Next.js 15+)
  const { id } = await params

  // Buscar el lead en la base de datos
  const lead = await prisma.lead.findUnique({
    where: { id: id },
    include: {
      service: true,
      region: true,
      cotizaciones: true, // Incluir cotizaciones si ya tiene alguna
    },
  })

  // Si no existe, mostrar página 404
  if (!lead) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {lead.codigo}
                </h1>
                {/* Badge de estado */}
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  lead.estado === 'NUEVO' ? 'bg-green-100 text-green-800' :
                  lead.estado === 'CONTACTADO' ? 'bg-blue-100 text-blue-800' :
                  lead.estado === 'COTIZANDO' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {lead.estado}
                </span>
                {/* Badge urgente */}
                {lead.urgente && (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    🚨 URGENTE
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Solicitud recibida el {formatearFecha(lead.createdAt)}
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard/leads">← Volver a Leads</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMNA PRINCIPAL - Info del lead */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* DATOS DEL CLIENTE */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                👤 Información del Cliente
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre</label>
                  <p className="text-base text-gray-900">{lead.clienteNombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Teléfono / WhatsApp</label>
                  <p className="text-base text-gray-900">{lead.clienteTelefono}</p>
                </div>
                {lead.clienteEmail && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-base text-gray-900">{lead.clienteEmail}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Dirección</label>
                  <p className="text-base text-gray-900">{lead.direccion}</p>
                  {lead.referencia && (
                    <p className="text-sm text-gray-500 mt-1">📍 {lead.referencia}</p>
                  )}
                </div>
              </div>
            </div>

            {/* SERVICIO SOLICITADO */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                🛠️ Servicio Solicitado
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{lead.service.icono}</div>
                <div>
                  <p className="text-xl font-semibold text-gray-900">{lead.service.nombre}</p>
                  <p className="text-sm text-gray-500">{lead.service.descripcion}</p>
                  <p className="text-sm font-medium text-blue-600 mt-1">
                    Precio base: {formatearMoneda(lead.service.precioBase.toNumber())} / {lead.service.unidad}
                  </p>
                </div>
              </div>
            </div>

            {/* DESCRIPCIÓN DEL PROBLEMA */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                📝 Descripción del Problema
              </h2>
              <p className="text-base text-gray-700 whitespace-pre-wrap">
                {lead.descripcion}
              </p>
            </div>

            {/* FOTOS (si hay) */}
            {lead.fotos.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  📸 Fotos Adjuntas
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {lead.fotos.map((foto, idx) => (
                    <img
                      key={idx}
                      src={foto}
                      alt={`Foto ${idx + 1}`}
                      className="rounded-lg border border-gray-200"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLUMNA LATERAL - Acciones */}
          <div className="space-y-6">
            
            {/* ACCIONES PRINCIPALES */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ⚡ Acciones Rápidas
              </h3>
              <div className="space-y-3">
                
                {/* Botón WhatsApp */}
                <a
                  href={`https://wa.me/${lead.clienteTelefono.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${lead.clienteNombre}, te contacto sobre tu solicitud ${lead.codigo} de ${lead.service.nombre}. ¿Podemos conversar?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    📱 Contactar por WhatsApp
                  </Button>
                </a>

                {/* Botón Crear Cotización */}
                {lead.cotizaciones.length === 0 ? (
  <Button asChild className="w-full" size="lg">
    <Link href={`/dashboard/cotizaciones/nueva?leadId=${lead.id}`}>
      📋 Crear Cotización
    </Link>
  </Button>
) : (
  <div className="space-y-2">
    <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-700 text-center">
      ✅ Ya tiene {lead.cotizaciones.length} cotización(es)
    </div>
    <Button asChild className="w-full" size="lg" variant="outline">
      <Link href={`/dashboard/cotizaciones/${lead.cotizaciones[0].id}`}>
        👁️ Ver Cotización
      </Link>
    </Button>
  </div>
)}
              </div>
            </div>

            {/* INFO ADICIONAL */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                ℹ️ Información Adicional
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Región:</span>
                  <span className="font-medium text-gray-900">
                    {lead.region.ciudad}, {lead.region.pais}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fuente:</span>
                  <span className="font-medium text-gray-900">{lead.fuente || 'web'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ID:</span>
                  <span className="font-mono text-xs text-gray-600">
                    {lead.id.substring(0, 8)}...
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