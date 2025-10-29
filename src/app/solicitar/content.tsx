'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface Service {
  id: string
  nombre: string
  icono: string
  descripcion: string
}

export default function SolicitarContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const servicioPreseleccionado = searchParams.get('servicio')

  const [servicios, setServicios] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)

  const [formData, setFormData] = useState({
    serviceId: servicioPreseleccionado || '',
    clienteNombre: '',
    clienteTelefono: '',
    clienteEmail: '',
    direccion: '',
    referencia: '',
    descripcion: '',
    urgente: false,
  })

  useEffect(() => {
    fetch('/api/servicios')
      .then((res) => res.json())
      .then((data) => {
        setServicios(data.services || [])
        if (servicioPreseleccionado) {
          setFormData((prev) => ({ ...prev, serviceId: servicioPreseleccionado }))
        }
      })
      .catch((err) => console.error('Error cargando servicios:', err))
      .finally(() => setLoading(false))
  }, [servicioPreseleccionado])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.serviceId) {
      alert('Por favor selecciona un servicio')
      return
    }

    if (!formData.clienteNombre.trim()) {
      alert('Por favor ingresa tu nombre')
      return
    }

    if (!formData.clienteTelefono.trim()) {
      alert('Por favor ingresa tu teléfono')
      return
    }

    if (!formData.direccion.trim()) {
      alert('Por favor ingresa tu dirección')
      return
    }

    if (!formData.descripcion.trim()) {
      alert('Por favor describe el problema')
      return
    }

    setEnviando(true)

    try {
      const response = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        alert(
          `✅ ¡Solicitud enviada exitosamente!\n\nTu código de seguimiento es: ${data.lead.codigo}\n\nTe contactaremos pronto por WhatsApp.`
        )
        router.push('/')
      } else {
        alert('❌ Error: ' + data.error)
      }
    } catch (err) {
      console.error('Error:', err)
      alert('❌ Error al enviar la solicitud. Por favor intenta nuevamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-4xl">⏳</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📝 Solicitar Servicio
          </h1>
          <p className="text-lg text-gray-600">
            Completa el formulario y te contactaremos pronto
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          
          <div>
            <Label htmlFor="servicio" className="text-base font-semibold text-gray-900">
              🛠️ ¿Qué servicio necesitas? *
            </Label>
            <select
              id="servicio"
              value={formData.serviceId}
              onChange={(e) =>
                setFormData({ ...formData, serviceId: e.target.value })
              }
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            >
              <option value="">-- Selecciona un servicio --</option>
              {servicios.map((servicio) => (
                <option key={servicio.id} value={servicio.id}>
                  {servicio.icono} {servicio.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="nombre" className="text-base font-semibold text-gray-900">
              👤 Tu nombre completo *
            </Label>
            <Input
              id="nombre"
              type="text"
              value={formData.clienteNombre}
              onChange={(e) =>
                setFormData({ ...formData, clienteNombre: e.target.value })
              }
              placeholder="Ej: Juan Pérez"
              className="mt-2 text-gray-900"
              required
            />
          </div>

          <div>
            <Label htmlFor="telefono" className="text-base font-semibold text-gray-900">
              📱 Teléfono / WhatsApp *
            </Label>
            <Input
              id="telefono"
              type="tel"
              value={formData.clienteTelefono}
              onChange={(e) =>
                setFormData({ ...formData, clienteTelefono: e.target.value })
              }
              placeholder="Ej: 0987654321"
              className="mt-2 text-gray-900"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-base font-semibold text-gray-900">
              📧 Email (opcional)
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.clienteEmail}
              onChange={(e) =>
                setFormData({ ...formData, clienteEmail: e.target.value })
              }
              placeholder="Ej: juan@ejemplo.com"
              className="mt-2 text-gray-900"
            />
          </div>

          <div>
            <Label htmlFor="direccion" className="text-base font-semibold text-gray-900">
              📍 Dirección *
            </Label>
            <Input
              id="direccion"
              type="text"
              value={formData.direccion}
              onChange={(e) =>
                setFormData({ ...formData, direccion: e.target.value })
              }
              placeholder="Ej: Av. 6 de Diciembre N34-120"
              className="mt-2 text-gray-900"
              required
            />
          </div>

          <div>
            <Label htmlFor="referencia" className="text-base font-semibold text-gray-900">
              🗺️ Referencia (opcional)
            </Label>
            <Input
              id="referencia"
              type="text"
              value={formData.referencia}
              onChange={(e) =>
                setFormData({ ...formData, referencia: e.target.value })
              }
              placeholder="Ej: Cerca del parado del Trole La Y"
              className="mt-2 text-gray-900"
            />
          </div>

          <div>
            <Label htmlFor="descripcion" className="text-base font-semibold text-gray-900">
              📝 Describe el problema *
            </Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              placeholder="Cuéntanos con detalle qué necesitas..."
              rows={5}
              className="mt-2 text-gray-900"
              required
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <input
              id="urgente"
              type="checkbox"
              checked={formData.urgente}
              onChange={(e) =>
                setFormData({ ...formData, urgente: e.target.checked })
              }
              className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <Label htmlFor="urgente" className="text-sm font-medium text-gray-900 cursor-pointer">
              🚨 Es urgente (necesito atención inmediata)
            </Label>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={enviando}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold"
              size="lg"
            >
              {enviando ? '⏳ Enviando...' : '📤 Enviar Solicitud'}
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500 pt-2">
            <p>Te contactaremos por WhatsApp en los próximos minutos</p>
            <p className="mt-1">📞 +593 987 531 450</p>
          </div>
        </form>
      </div>
    </div>
  )
}