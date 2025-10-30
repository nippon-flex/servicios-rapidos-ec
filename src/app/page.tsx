import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* HEADER */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold text-gray-900">Servicios Rápidos EC</span>
          </div>
          
          {/* Botones de acción */}
          <div className="flex items-center gap-3">
            <Link
              href="/servicios"
              className="hidden md:inline-flex items-center gap-2 text-gray-700 hover:text-blue-600 font-semibold transition-all"
            >
              📋 Servicios
            </Link>
            
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-2 border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-5 py-2 rounded-lg font-semibold transition-all"
            >
              <span>🔐</span>
              Acceder a la App
            </Link>
            
            <a
              href="https://wa.me/593987531450?text=Hola,%20necesito%20un%20servicio"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all hover:scale-105 shadow-md flex items-center gap-2"
            >
              <span>📱</span>
              <span className="hidden sm:inline">WhatsApp</span>
              <span className="sm:hidden">Contacto</span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center">
        {/* Imagen de Fondo */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=2069&auto=format&fit=crop"
            alt="Profesional trabajando"
            className="w-full h-full object-cover"
          />
          {/* Overlay oscuro para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/50"></div>
        </div>

        {/* Contenido */}
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            {/* Badge de Urgencia */}
            <div className="inline-flex items-center gap-2 bg-green-500/90 backdrop-blur-sm border border-green-300 text-white px-4 py-2 rounded-full mb-6 animate-pulse shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span className="text-sm font-semibold">Disponible 24/7 en Quito</span>
            </div>

            {/* Título Principal */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              El Único Servicio en Quito<br />que Te Garantiza:
            </h1>

            {/* Beneficios Principales */}
            <div className="space-y-4 mb-10">
              <div className="flex items-center justify-center gap-3 text-lg md:text-xl text-white">
                <span className="text-green-400 text-2xl">✅</span>
                <span className="font-semibold drop-shadow">Precio justo y claro desde el inicio</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-lg md:text-xl text-white">
                <span className="text-green-400 text-2xl">✅</span>
                <span className="font-semibold drop-shadow">Maestro verificado con cédula</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-lg md:text-xl text-white">
                <span className="text-green-400 text-2xl">✅</span>
                <span className="font-semibold drop-shadow">Si no queda bien, volvemos GRATIS</span>
              </div>
            </div>

            {/* CTAs Principales */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a
                href="https://wa.me/593987531450?text=Hola,%20necesito%20un%20servicio%20urgente"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 shadow-2xl w-full sm:w-auto border-2 border-blue-400"
              >
                🚨 Solicitar Servicio Ahora
              </a>
              <Link
                href="/servicios"
                className="bg-white/10 backdrop-blur-sm border-2 border-white/50 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-2xl w-full sm:w-auto"
              >
                📋 Ver Todos los Servicios
              </Link>
            </div>

            {/* Prueba Social */}
            <p className="text-white/90 text-sm drop-shadow">
              ⭐⭐⭐⭐⭐ <span className="font-semibold">+500 servicios realizados</span> en Quito
            </p>
          </div>
        </div>
      </section>

      {/* POR QUÉ CONFIAR */}
      <section className="bg-white py-16 border-y">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            ¿Por Qué Confiar en Nosotros?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Razón 1 */}
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all hover:scale-105">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Maestros Verificados</h3>
              <p className="text-gray-600">
                Todos nuestros profesionales están verificados con cédula, experiencia comprobada y antecedentes limpios.
              </p>
            </div>

            {/* Razón 2 */}
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all hover:scale-105">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Precio Transparente</h3>
              <p className="text-gray-600">
                Cotización clara ANTES de iniciar. Sin sorpresas, sin cobros ocultos, sin excusas.
              </p>
            </div>

            {/* Razón 3 */}
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all hover:scale-105">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Respuesta Inmediata</h3>
              <p className="text-gray-600">
                Atención 24/7. En emergencias, llegamos en menos de 2 horas a cualquier sector de Quito.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Así de Fácil es Trabajar con Nosotros
          </h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {/* Paso 1 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Contáctanos</h3>
              <p className="text-gray-600 text-sm">Por WhatsApp o formulario web</p>
            </div>

            {/* Paso 2 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Recibe Cotización</h3>
              <p className="text-gray-600 text-sm">Precio claro en minutos</p>
            </div>

            {/* Paso 3 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Agendar Visita</h3>
              <p className="text-gray-600 text-sm">Maestro verificado llega puntual</p>
            </div>

            {/* Paso 4 */}
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold text-lg mb-2">Problema Resuelto</h3>
              <p className="text-gray-600 text-sm">Con garantía de satisfacción</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS - CARRUSEL */}
      <section className="bg-white py-16 border-y overflow-hidden">
        <div className="container mx-auto px-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
            Nuestros Servicios
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-6">
            Profesionales verificados para cada necesidad de tu hogar o negocio
          </p>
          {/* Botón Ver Todos */}
          <div className="text-center">
            <Link
              href="/servicios"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg"
            >
              📋 Ver Catálogo Completo de Servicios
            </Link>
          </div>
        </div>

        {/* Carrusel Infinito */}
        <div className="relative">
          <div className="flex animate-scroll-services">
            {/* Primera serie de servicios */}
            <div className="flex gap-6 px-3">
              {/* Plomería */}
              <div className="min-w-[280px] bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">🔧</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Plomería</h3>
                <p className="text-gray-700 text-sm">Fugas, instalaciones, destapes, reparaciones y mantenimiento</p>
              </div>

              {/* Electricidad */}
              <div className="min-w-[280px] bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">⚡</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Electricidad</h3>
                <p className="text-gray-700 text-sm">Instalaciones eléctricas, reparaciones y mantenimiento preventivo</p>
              </div>

              {/* Construcción */}
              <div className="min-w-[280px] bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">🔨</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Construcción</h3>
                <p className="text-gray-700 text-sm">Remodelaciones, obra gris, acabados y ampliaciones</p>
              </div>

              {/* Pintura */}
              <div className="min-w-[280px] bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">🎨</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Pintura</h3>
                <p className="text-gray-700 text-sm">Interior, exterior, decorativa y acabados especiales</p>
              </div>

              {/* Cerrajería */}
              <div className="min-w-[280px] bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">🔐</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Cerrajería</h3>
                <p className="text-gray-700 text-sm">Apertura de puertas, cambio de chapas y duplicado de llaves</p>
              </div>

              {/* Carpintería */}
              <div className="min-w-[280px] bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">🪚</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Carpintería</h3>
                <p className="text-gray-700 text-sm">Muebles a medida, puertas, closets y reparaciones</p>
              </div>

              {/* Limpieza */}
              <div className="min-w-[280px] bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">🧹</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Limpieza</h3>
                <p className="text-gray-700 text-sm">Limpieza profunda, post-construcción y mantenimiento</p>
              </div>

              {/* Jardinería */}
              <div className="min-w-[280px] bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">🌱</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Jardinería</h3>
                <p className="text-gray-700 text-sm">Diseño, mantenimiento, poda y sistemas de riego</p>
              </div>

              {/* Aire Acondicionado */}
              <div className="min-w-[280px] bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">❄️</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Aire Acondicionado</h3>
                <p className="text-gray-700 text-sm">Instalación, mantenimiento y reparación de equipos</p>
              </div>

              {/* Albañilería */}
              <div className="min-w-[280px] bg-gradient-to-br from-stone-50 to-stone-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">🧱</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Albañilería</h3>
                <p className="text-gray-700 text-sm">Muros, pisos, contrapisos y trabajos en concreto</p>
              </div>

              {/* Vidriería */}
              <div className="min-w-[280px] bg-gradient-to-br from-sky-50 to-sky-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">🪟</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Vidriería</h3>
                <p className="text-gray-700 text-sm">Instalación de ventanas, espejos y trabajos en vidrio</p>
              </div>

              {/* Fumigación */}
              <div className="min-w-[280px] bg-gradient-to-br from-lime-50 to-lime-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">🦟</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Fumigación</h3>
                <p className="text-gray-700 text-sm">Control de plagas residencial y comercial</p>
              </div>
            </div>

            {/* Segunda serie (duplicado para loop infinito) */}
            <div className="flex gap-6 px-3" aria-hidden="true">
              <div className="min-w-[280px] bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">🔧</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Plomería</h3>
                <p className="text-gray-700 text-sm">Fugas, instalaciones, destapes, reparaciones y mantenimiento</p>
              </div>

              <div className="min-w-[280px] bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">⚡</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Electricidad</h3>
                <p className="text-gray-700 text-sm">Instalaciones eléctricas, reparaciones y mantenimiento preventivo</p>
              </div>

              <div className="min-w-[280px] bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">🔨</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Construcción</h3>
                <p className="text-gray-700 text-sm">Remodelaciones, obra gris, acabados y ampliaciones</p>
              </div>

              <div className="min-w-[280px] bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">🎨</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Pintura</h3>
                <p className="text-gray-700 text-sm">Interior, exterior, decorativa y acabados especiales</p>
              </div>

              <div className="min-w-[280px] bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">🔐</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Cerrajería</h3>
                <p className="text-gray-700 text-sm">Apertura de puertas, cambio de chapas y duplicado de llaves</p>
              </div>

              <div className="min-w-[280px] bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">🪚</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Carpintería</h3>
                <p className="text-gray-700 text-sm">Muebles a medida, puertas, closets y reparaciones</p>
              </div>

              <div className="min-w-[280px] bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">🧹</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Limpieza</h3>
                <p className="text-gray-700 text-sm">Limpieza profunda, post-construcción y mantenimiento</p>
              </div>

              <div className="min-w-[280px] bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">🌱</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Jardinería</h3>
                <p className="text-gray-700 text-sm">Diseño, mantenimiento, poda y sistemas de riego</p>
              </div>

              <div className="min-w-[280px] bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">❄️</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Aire Acondicionado</h3>
                <p className="text-gray-700 text-sm">Instalación, mantenimiento y reparación de equipos</p>
              </div>

              <div className="min-w-[280px] bg-gradient-to-br from-stone-50 to-stone-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">🧱</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Albañilería</h3>
                <p className="text-gray-700 text-sm">Muros, pisos, contrapisos y trabajos en concreto</p>
              </div>

              <div className="min-w-[280px] bg-gradient-to-br from-sky-50 to-sky-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">🪟</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Vidriería</h3>
                <p className="text-gray-700 text-sm">Instalación de ventanas, espejos y trabajos en vidrio</p>
              </div>

              <div className="min-w-[280px] bg-gradient-to-br from-lime-50 to-lime-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105">
                <div className="text-5xl mb-3">🦟</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">Fumigación</h3>
                <p className="text-gray-700 text-sm">Control de plagas residencial y comercial</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Testimonio 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all">
              <div className="text-yellow-500 text-2xl mb-3">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-4 italic">
                "Tuve una fuga en la madrugada y respondieron de inmediato. El maestro llegó en 90 minutos y resolvió todo. Precio justo y sin sorpresas."
              </p>
              <p className="font-semibold text-gray-900">— María González</p>
              <p className="text-gray-500 text-sm">La Carolina</p>
            </div>

            {/* Testimonio 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all">
              <div className="text-yellow-500 text-2xl mb-3">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-4 italic">
                "Contraté 3 electricistas antes y ninguno resolvió el problema. Estos llegaron, identificaron la falla en minutos y lo arreglaron. Profesionales de verdad."
              </p>
              <p className="font-semibold text-gray-900">— Carlos Méndez</p>
              <p className="text-gray-500 text-sm">Cumbayá</p>
            </div>

            {/* Testimonio 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all">
              <div className="text-yellow-500 text-2xl mb-3">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-4 italic">
                "Me dieron la cotización por WhatsApp antes de venir. El precio final fue exactamente el mismo. Eso es honestidad. Los recomiendo 100%."
              </p>
              <p className="font-semibold text-gray-900">— Andrea Romero</p>
              <p className="text-gray-500 text-sm">Tumbaco</p>
            </div>
          </div>
        </div>
      </section>

      {/* GARANTÍA DESTACADA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="text-6xl mb-6">🛡️</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Garantía de Satisfacción Total
            </h2>
            <p className="text-xl text-blue-50 mb-8 leading-relaxed">
              Si el trabajo no queda bien a la primera, <span className="font-bold text-white">volvemos GRATIS</span> hasta que quedes 100% satisfecho. Sin letra chica, sin excusas.
            </p>
            <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg p-6 inline-block">
              <p className="text-white font-semibold text-lg">
                ✅ Garantía por escrito en cada servicio<br />
                ✅ Seguimiento post-servicio incluido<br />
                ✅ Soporte 24/7 para emergencias
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            ¿Listo para Resolver tu Problema?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            No esperes a que empeore. Contáctanos ahora y recibe una cotización en minutos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <a
              href="https://wa.me/593987531450?text=Hola,%20quiero%20solicitar%20un%20servicio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-lg font-bold text-xl transition-all hover:scale-105 shadow-xl"
            >
              <span className="text-3xl">📱</span>
              Contactar por WhatsApp
            </a>
            <Link
              href="/servicios"
              className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-lg font-bold text-xl transition-all hover:scale-105 shadow-xl"
            >
              <span className="text-3xl">📋</span>
              Ver Todos los Servicios
            </Link>
          </div>
          <p className="text-gray-500 text-sm">
            Respuesta inmediata • Cotización gratis • Sin compromiso
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Columna 1 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚡</span>
                <span className="text-xl font-bold">Servicios Rápidos EC</span>
              </div>
              <p className="text-gray-400">
                Servicios profesionales para tu hogar en Quito, Ecuador. Rápidos, confiables y garantizados.
              </p>
            </div>

            {/* Columna 2 */}
            <div>
              <h3 className="font-bold mb-4">Contacto</h3>
              <div className="space-y-2 text-gray-400">
                <p>📱 +593 987 531 450</p>
                <p>📧 rmillan960@gmail.com</p>
                <p>📍 Quito, Ecuador</p>
              </div>
            </div>

            {/* Columna 3 */}
            <div>
              <h3 className="font-bold mb-4">Horarios</h3>
              <div className="space-y-2 text-gray-400">
                <p>🕐 Atención: 24/7</p>
                <p>⚡ Emergencias: Inmediato</p>
                <p>📅 Servicios programados: L-D</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Servicios Rápidos EC. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}