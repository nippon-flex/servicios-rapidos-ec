import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function ServiciosPublicosPage() {
  // ✅ SOLO usamos campos que SÍ existen
  const servicios = await prisma.service.findMany({
    where: {
      activo: true,
    },
    orderBy: {
      nombre: 'asc',  // ← Ordenar por nombre (orden no existe)
    },
  });

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
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="https://wa.me/593987531450?text=Hola,%20necesito%20información%20sobre%20sus%20servicios"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 shadow-lg flex items-center gap-2"
              >
                📱 WhatsApp
              </a>
              <Link
                href="/"
                className="bg-white/10 backdrop-blur-sm border-2 border-white/50 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
              >
                ← Volver al Inicio
              </Link>
            </div>
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

        {servicios.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No hay servicios disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicios.map((servicio) => (
              <div
                key={servicio.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100"
              >
                {/* Icono */}
                <div className="text-5xl mb-4">
                  {servicio.icono || '🛠️'}
                </div>
                
                {/* Nombre */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {servicio.nombre}
                </h3>
                
                {/* Descripción */}
                <p className="text-gray-600 text-sm mb-4">
                  {servicio.descripcion}
                </p>
                
                {/* Botón */}
                <Link
                  href={`/solicitar?servicio=${servicio.id}`}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-semibold transition-all hover:scale-105"
                >
                  📝 Solicitar Servicio
                </Link>
              </div>
            ))}
          </div>
        )}
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
            <a
              href="https://wa.me/593987531450?text=Hola,%20necesito%20información%20sobre%20sus%20servicios"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 shadow-lg"
            >
              📱 Contactar por WhatsApp
            </a>
            <Link
              href="/"
              className="border-2 border-white text-white hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
            >
              ← Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}