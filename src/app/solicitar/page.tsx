'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function SolicitarPage() {
  const searchParams = useSearchParams()
  const servicioParam = searchParams.get('servicio')

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    servicio: servicioParam || '',
    descripcion: '',
    urgente: false,
  })

  const servicios = [
    { slug: 'plomeria', nombre: '🔧 Plomería' },
    { slug: 'electricidad', nombre: '⚡ Electricidad' },
    { slug: 'albanileria', nombre: '🧱 Albañilería' },
    { slug: 'pintura', nombre: '🎨 Pintura' },
    { slug: 'carpinteria', nombre: '🪚 Carpintería' },
    { slug: 'cerrajeria', nombre: '🔐 Cerrajería' },
    { slug: 'limpieza', nombre: '🧹 Limpieza Profunda' },
    { slug: 'fumigacion', nombre: '🐛 Fumigación' },
    { slug: 'aire-acondicionado', nombre: '❄️ Aire Acondicionado' },
    { slug: 'jardineria', nombre: '🌱 Jardinería' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar solicitud')
      }

      setSuccess(true)
      // Resetear formulario
      setFormData({
        nombre: '',
        telefono: '',
        email: '',
        direccion: '',
        servicio: '',
        descripcion: '',
        urgente: false,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Solicitud Enviada!
          </h1>
          <p className="text-gray-600 mb-6">
            Hemos recibido tu solicitud correctamente. Te contactaremos por WhatsApp en las próximas horas con tu cotización.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/servicios">
                ← Volver a Servicios
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <a href={`https://wa.me/593987531450?text=${encodeURIComponent('Hola, acabo de enviar una solicitud')}`} target="_blank">
                📱 Escribir por WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/servicios" className="text-blue-100 hover:text-white mb-4 inline-block">
            ← Volver a servicios
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            📝 Solicitar Servicio
          </h1>
          <p className="text-blue-100">
            Completa el formulario y te enviaremos una cotización en menos de 24 horas
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Nombre */}
          <div>
            <Label htmlFor="nombre">
              Nombre completo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombre"
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: María González"
              className="mt-1"
            />
          </div>

          {/* Teléfono */}
          <div>
            <Label htmlFor="telefono">
              WhatsApp / Teléfono <span className="text-red-500">*</span>
            </Label>
            <Input
              id="telefono"
              type="tel"
              required
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="Ej: 099 123 4567"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Te contactaremos por WhatsApp a este número
            </p>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email (opcional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Ej: maria@ejemplo.com"
              className="mt-1"
            />
          </div>

          {/* Servicio */}
          <div>
            <Label htmlFor="servicio">
              Servicio solicitado <span className="text-red-500">*</span>
            </Label>
            <select
              id="servicio"
              required
              value={formData.servicio}
              onChange={(e) => setFormData({ ...formData, servicio: e.target.value })}
              className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <option value="">Selecciona un servicio</option>
              {servicios.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Dirección */}
          <div>
            <Label htmlFor="direccion">
              Dirección <span className="text-red-500">*</span>
            </Label>
            <Input
              id="direccion"
              type="text"
              required
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              placeholder="Ej: Av. 6 de Diciembre y Portugal"
              className="mt-1"
            />
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="descripcion">
              Descripción del problema o necesidad <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="descripcion"
              required
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Describe con detalle qué necesitas. Ej: Fuga de agua en el baño, gotea desde el techo..."
              rows={4}
              className="mt-1"
            />
          </div>

          {/* Urgente */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="urgente"
              checked={formData.urgente}
              onChange={(e) => setFormData({ ...formData, urgente: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="urgente" className="cursor-pointer">
              🚨 Es urgente (requiero atención prioritaria)
            </Label>
          </div>

          {/* Botón */}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Enviando...' : '📤 Enviar Solicitud'}
          </Button>

          <p className="text-xs text-center text-gray-500">
            Al enviar, aceptas nuestras políticas de privacidad y servicio
          </p>
        </form>
      </div>
    </div>
  )
}