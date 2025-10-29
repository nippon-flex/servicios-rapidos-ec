import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-3xl">⚡</div>
              <h1 className="text-2xl font-bold text-gray-900">
                Servicios Rápidos EC
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://wa.me/593987531450"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                📱 +593 987 531 450
              </a>
              <Button asChild variant="outline">
                <Link href="/sign-in">Iniciar Sesión</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            Servicios para tu Hogar
            <span className="block text-blue-600 mt-2">
              Rápidos y Confiables
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Plomería, electricidad, pintura y más. Maestros expertos en Quito.
            Cotización gratis en minutos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/solicitar">
                📋 Solicitar Servicio Ahora
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
              <Link href="/servicios">
                🛠️ Ver Servicios
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SERVICIOS DESTACADOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Nuestros Servicios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icono: '🔧', nombre: 'Plomería', desc: 'Reparaciones, instalaciones y más' },
            { icono: '💡', nombre: 'Electricidad', desc: 'Instalaciones y mantenimiento' },
            { icono: '🎨', nombre: 'Pintura', desc: 'Interior y exterior profesional' },
            { icono: '🔨', nombre: 'Carpintería', desc: 'Muebles y reparaciones' },
            { icono: '❄️', nombre: 'Refrigeración', desc: 'Mantenimiento de equipos' },
            { icono: '🧹', nombre: 'Limpieza', desc: 'Profunda y mantenimiento' },
          ].map((servicio) => (
            <div
              key={servicio.nombre}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="text-5xl mb-4">{servicio.icono}</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {servicio.nombre}
              </h4>
              <p className="text-gray-600">{servicio.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link href="/servicios">Ver Todos los Servicios →</Link>
          </Button>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Cómo Funciona?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: '1', titulo: 'Solicita', desc: 'Llena el formulario con tu necesidad' },
              { num: '2', titulo: 'Cotización', desc: 'Te enviamos presupuesto por WhatsApp' },
              { num: '3', titulo: 'Aprueba', desc: 'Confirma y agenda la visita' },
              { num: '4', titulo: 'Disfruta', desc: 'Trabajo profesional con garantía' },
            ].map((paso) => (
              <div key={paso.num} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {paso.num}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {paso.titulo}
                </h4>
                <p className="text-gray-600">{paso.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            ¿Listo para Resolver tu Problema?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Cotización gratis en minutos. Garantía de 90 días.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
              <Link href="/solicitar">
                📋 Solicitar Servicio
              </Link>
            </Button>
            <a
              href="https://wa.me/593987531450?text=Hola,%20necesito%20información%20sobre%20sus%20servicios"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6">
                💬 WhatsApp Directo
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Servicios Rápidos EC - Quito, Ecuador
          </p>
          <p className="text-gray-500 text-sm mt-2">
            📞 +593 987 531 450 | Rafael Millan
          </p>
        </div>
      </footer>
    </div>
  )
}