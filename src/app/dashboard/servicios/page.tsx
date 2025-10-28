import { prisma } from '@/lib/prisma'
import { formatearMoneda } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function ServiciosPublicosPage() {
  // Obtener región de Quito
  const region = await prisma.region.findFirst({
    where: {
      ciudad: 'Quito',
      pais: 'Ecuador',
    },
  })

  // Obtener servicios activos
  const servicios = await prisma.service.findMany({
    where: {
      regionId: region?.id,
      activo: true,
    },
    orderBy: {
      orden: 'asc',
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🏠 Servicios Rápidos EC
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Soluciones profesionales para tu hogar en Quito
            </p>
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/solicitar">
                📝 Solicitar Servicio Ahora
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Servicios */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-lg text-gray-600">
            Profesionales calificados para cada necesidad de tu hogar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicios.map((servicio) => (
            <div
              key={servicio.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100"
            >
              {/* Icono */}
              <div className="text-5xl mb-4">{servicio.icono}</div>
              
              {/* Nombre */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {servicio.nombre}
              </h3>
              
              {/* Descripción */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {servicio.descripcion}
              </p>
              
              {/* Precio */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm text-gray-500">Desde</span>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatearMoneda(servicio.precioBase)}
                  </p>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  por {servicio.unidad}
                </span>
              </div>
              
              {/* Botón */}
              <Button asChild className="w-full">
                <Link href={`/solicitar?servicio=${servicio.slug}`}>
                  Solicitar
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Beneficios */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-lg font-semibold mb-2">Profesionales Calificados</h3>
              <p className="text-gray-600 text-sm">
                Maestros verificados y con experiencia comprobada
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-lg font-semibold mb-2">Garantía de 90 Días</h3>
              <p className="text-gray-600 text-sm">
                Respaldamos nuestro trabajo con garantía extendida
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold mb-2">Respuesta Rápida</h3>
              <p className="text-gray-600 text-sm">
                Cotización en menos de 24 horas hábiles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Solicita tu cotización gratuita en menos de 2 minutos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/solicitar">
                📝 Solicitar Servicio
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
              <a href={`https://wa.me/593987531450?text=${encodeURIComponent('Hola, necesito información sobre sus servicios')}`} target="_blank">
                📱 WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}