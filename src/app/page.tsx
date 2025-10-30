'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [showPoliticas, setShowPoliticas] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const servicios = [
    { icon: '🔧', name: 'Plomería', desc: 'Fugas, instalaciones, destapes, reparaciones y mantenimiento' },
    { icon: '⚡', name: 'Electricidad', desc: 'Instalaciones eléctricas, reparaciones y mantenimiento preventivo' },
    { icon: '🔨', name: 'Construcción', desc: 'Remodelaciones, obra gris, acabados y ampliaciones' },
    { icon: '🎨', name: 'Pintura', desc: 'Interior, exterior, decorativa y acabados especiales' },
    { icon: '🔐', name: 'Cerrajería', desc: 'Apertura de puertas, cambio de chapas y duplicado de llaves' },
    { icon: '🪚', name: 'Carpintería', desc: 'Muebles a medida, puertas, closets y reparaciones' },
    { icon: '🧹', name: 'Limpieza', desc: 'Limpieza profunda, post-construcción y mantenimiento' },
    { icon: '🌱', name: 'Jardinería', desc: 'Diseño, mantenimiento, poda y sistemas de riego' },
    { icon: '❄️', name: 'Aire Acondicionado', desc: 'Instalación, mantenimiento y reparación de equipos' },
    { icon: '🧱', name: 'Albañilería', desc: 'Muros, pisos, contrapisos y trabajos en concreto' },
    { icon: '🪟', name: 'Vidriería', desc: 'Instalación de ventanas, espejos y trabajos en vidrio' },
    { icon: '🦟', name: 'Fumigación', desc: 'Control de plagas residencial y comercial' },
  ];

  // Auto-avanzar carrusel cada 3 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % servicios.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [servicios.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % servicios.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + servicios.length) % servicios.length);
  };

  // Calcular servicios visibles (3 en desktop, 1 en mobile)
  const getVisibleServices = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(servicios[(currentSlide + i) % servicios.length]);
    }
    return visible;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Servicios Rápidos EC
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/servicios"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span>📋</span>
              <span className="font-medium">Servicios</span>
            </Link>

            <Link
              href="/sign-in"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all"
            >
              <span>🔐</span>
              <span className="font-medium">Acceder a la App</span>
            </Link>

            <a
              href="https://wa.me/593987531450?text=Hola,%20necesito%20información%20sobre%20sus%20servicios"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all hover:shadow-lg"
            >
              <span>📱</span>
              <span className="font-medium">WhatsApp</span>
            </a>
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden flex gap-2">
            <Link
              href="/sign-in"
              className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
            >
              🔐 App
            </Link>
            <a
              href="https://wa.me/593987531450"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg bg-green-500 text-white text-sm font-medium"
            >
              📱 WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in-up">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                ⚡ Disponible 24/7 en Quito
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  El Único Servicio en Quito
                </span>
                <br />
                <span className="text-gray-800">que Te Garantiza:</span>
              </h1>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <p className="text-lg text-gray-700">
                    <strong>Precio justo y claro</strong> desde el inicio
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <p className="text-lg text-gray-700">
                    <strong>Maestro verificado</strong> con cédula
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <p className="text-lg text-gray-700">
                    <strong>Si no queda bien,</strong> volvemos GRATIS
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/solicitar"
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all text-center"
                >
                  🚨 Solicitar Servicio Ahora
                </Link>
                <Link
                  href="/servicios"
                  className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all text-center"
                >
                  📋 Ver Todos los Servicios
                </Link>
              </div>

              <p className="text-sm text-gray-600">
                ⭐⭐⭐⭐⭐ +500 servicios realizados en Quito
              </p>
            </div>

            <div className="relative animate-fade-in">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-1 shadow-2xl">
                <div className="w-full h-full rounded-2xl bg-white p-8 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-8xl">👷</div>
                    <p className="text-xl font-bold text-gray-800">
                      Profesional trabajando
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            ¿Por Qué Confiar en Nosotros?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6 rounded-xl hover:shadow-xl transition-all">
              <div className="text-5xl">🛡️</div>
              <h3 className="text-xl font-bold">Maestros Verificados</h3>
              <p className="text-gray-600">
                Todos nuestros profesionales están verificados con cédula,
                experiencia comprobada y antecedentes limpios.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-xl hover:shadow-xl transition-all">
              <div className="text-5xl">💰</div>
              <h3 className="text-xl font-bold">Precio Transparente</h3>
              <p className="text-gray-600">
                Cotización clara ANTES de iniciar. Sin sorpresas, sin cobros
                ocultos, sin excusas.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-xl hover:shadow-xl transition-all">
              <div className="text-5xl">⚡</div>
              <h3 className="text-xl font-bold">Respuesta Inmediata</h3>
              <p className="text-gray-600">
                Atención 24/7. En emergencias, llegamos en menos de 2 horas a
                cualquier sector de Quito.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Así de Fácil es Trabajar con Nosotros
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Contáctanos',
                desc: 'Por WhatsApp o formulario web',
              },
              {
                step: '2',
                title: 'Recibe Cotización',
                desc: 'Precio claro en minutos',
              },
              {
                step: '3',
                title: 'Agendar Visita',
                desc: 'Maestro verificado llega puntual',
              },
              {
                step: '4',
                title: 'Problema Resuelto',
                desc: 'Con garantía de satisfacción',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="text-center space-y-3 p-6 bg-white rounded-xl shadow-md"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Carousel */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-gray-600 text-lg">
              Profesionales verificados para cada necesidad de tu hogar o negocio
            </p>
          </div>

          {/* Carrusel */}
          <div className="relative max-w-6xl mx-auto">
            {/* Botón anterior */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-xl hover:bg-blue-50 transition-all"
              aria-label="Anterior"
            >
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Servicios visibles */}
            <div className="overflow-hidden px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Mobile: solo muestra el actual */}
                <div className="md:hidden">
                  <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
                    <div className="text-6xl mb-4 text-center">{servicios[currentSlide].icon}</div>
                    <h3 className="font-bold text-xl mb-3 text-center">{servicios[currentSlide].name}</h3>
                    <p className="text-gray-600 text-center">{servicios[currentSlide].desc}</p>
                  </div>
                </div>

                {/* Desktop: muestra 3 */}
                {getVisibleServices().map((service, idx) => (
                  <div
                    key={`${service.name}-${idx}`}
                    className="hidden md:block p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
                  >
                    <div className="text-6xl mb-4 text-center">{service.icon}</div>
                    <h3 className="font-bold text-xl mb-3 text-center">{service.name}</h3>
                    <p className="text-gray-600 text-center">{service.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Botón siguiente */}
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-xl hover:bg-blue-50 transition-all"
              aria-label="Siguiente"
            >
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Indicadores */}
            <div className="flex justify-center gap-2 mt-8">
              {servicios.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentSlide
                      ? 'bg-blue-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir a servicio ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/servicios"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
            >
              📋 Ver Catálogo Completo de Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Lo Que Dicen Nuestros Clientes
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: 'Tuve una fuga en la madrugada y respondieron de inmediato. El maestro llegó en 90 minutos y resolvió todo. Precio justo y sin sorpresas.',
                author: 'María González',
                location: 'La Carolina',
              },
              {
                text: 'Contraté 3 electricistas antes y ninguno resolvió el problema. Estos llegaron, identificaron la falla en minutos y lo arreglaron. Profesionales de verdad.',
                author: 'Carlos Méndez',
                location: 'Cumbayá',
              },
              {
                text: 'Me dieron la cotización por WhatsApp antes de venir. El precio final fue exactamente el mismo. Eso es honestidad. Los recomiendo 100%.',
                author: 'Andrea Romero',
                location: 'Tumbaco',
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-yellow-500 text-2xl mb-3">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-700 mb-4 italic">
                  &quot;{testimonial.text}&quot;
                </p>
                <div className="border-t pt-4">
                  <p className="font-bold">— {testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center space-y-6">
          <div className="text-6xl">🛡️</div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Garantía de Satisfacción Total
          </h2>
          <p className="text-xl max-w-3xl mx-auto">
            Si el trabajo no queda bien a la primera, volvemos GRATIS hasta que
            quedes 100% satisfecho. Sin letra chica, sin excusas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>Garantía por escrito en cada servicio</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>Seguimiento post-servicio incluido</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>Soporte 24/7 para emergencias</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            ¿Listo para Resolver tu Problema?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No esperes a que empeore. Contáctanos ahora y recibe una cotización
            en minutos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a
              href="https://wa.me/593987531450?text=Hola,%20necesito%20un%20servicio"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 transition-all hover:shadow-xl inline-flex items-center justify-center gap-2"
            >
              <span>📱</span>
              <span>Contactar por WhatsApp</span>
            </a>
            <Link
              href="/servicios"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2"
            >
              <span>📋</span>
              <span>Ver Todos los Servicios</span>
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            Respuesta inmediata • Cotización gratis • Sin compromiso
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚡</span>
                <span className="font-bold text-xl">Servicios Rápidos EC</span>
              </div>
              <p className="text-gray-400">
                Servicios profesionales para tu hogar en Quito, Ecuador.
                Rápidos, confiables y garantizados.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Contacto</h3>
              <div className="space-y-2 text-gray-400">
                <p>📱 +593 987 531 450</p>
                <p>📧 rmillan960@gmail.com</p>
                <p>📍 Quito, Ecuador</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Horarios</h3>
              <div className="space-y-2 text-gray-400">
                <p>🕐 Atención: 24/7</p>
                <p>⚡ Emergencias: Inmediato</p>
                <p>📅 Servicios programados: L-D</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <div className="mb-4">
              <button
                onClick={() => setShowPoliticas(true)}
                className="text-blue-400 hover:text-blue-300 underline transition-colors"
              >
                Políticas de Garantía
              </button>
            </div>
            <p>© 2025 Servicios Rápidos EC. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modal de Políticas */}
      {showPoliticas && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">🛡️ Políticas de Garantía</h2>
              <button
                onClick={() => setShowPoliticas(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-3">
                  ✅ Garantía de 90 Días
                </h3>
                <p className="text-gray-700">
                  Todos nuestros servicios incluyen una garantía de satisfacción
                  de 90 días naturales a partir de la fecha de finalización del
                  trabajo.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">🔧 Qué Está Cubierto</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Defectos en la mano de obra</li>
                  <li>• Fallas en la instalación</li>
                  <li>• Problemas derivados del servicio realizado</li>
                  <li>• Revisión sin costo adicional</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">❌ Qué NO Está Cubierto</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Daños por mal uso del cliente</li>
                  <li>• Desgaste normal de materiales</li>
                  <li>• Modificaciones realizadas por terceros</li>
                  <li>• Desastres naturales o casos fortuitos</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">📋 Cómo Reclamar</h3>
                <ol className="space-y-2 text-gray-700">
                  <li>1. Contacta por WhatsApp o correo</li>
                  <li>2. Proporciona tu código de orden</li>
                  <li>3. Describe el problema (fotos ayudan)</li>
                  <li>4. Agendamos visita de revisión GRATIS</li>
                  <li>5. Reparamos sin costo si aplica garantía</li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">📝 Términos Adicionales</h3>
                <p className="text-gray-700 text-sm">
                  La garantía es válida únicamente para el trabajo original
                  realizado por nuestro personal. Los materiales instalados por
                  nosotros tienen la garantía del fabricante (cuando aplique). En
                  caso de materiales proporcionados por el cliente, la garantía
                  cubre únicamente la instalación.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  ¿Tienes dudas sobre tu garantía?
                </p>
                <a
                  href="https://wa.me/593987531450?text=Tengo%20una%20consulta%20sobre%20la%20garantía"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  📱 Contactar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}