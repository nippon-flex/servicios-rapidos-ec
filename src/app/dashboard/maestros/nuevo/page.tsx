'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function NuevoMaestroPage() {
  const router = useRouter()
  const [guardando, setGuardando] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    ci: '',
    especialidades: '',
    cuentaBanco: '',
  })

  const guardarMaestro = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre.trim() || !formData.telefono.trim()) {
      alert('Nombre y teléfono son obligatorios')
      return
    }

    setGuardando(true)

    try {
      const especialidadesArray = formData.especialidades
        .split(',')
        .map((e) => e.trim())
        .filter((e) => e.length > 0)

      const response = await fetch('/api/maestros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          telefono: formData.telefono.trim(),
          ci: formData.ci.trim() || null,
          especialidades: especialidadesArray,
          cuentaBanco: formData.cuentaBanco.trim() || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(`✅ Maestro ${data.maestro.nombre} creado exitosamente`)
        router.push('/dashboard/maestros')
      } else {
        alert('❌ Error: ' + data.error)
      }
    } catch (err) {
      alert('❌ Error al crear maestro')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER - MISMO ESTILO QUE COTIZACIONES */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nuevo Maestro</h1>
              <p className="mt-1 text-sm text-gray-500">
                Agrega un nuevo miembro a tu equipo de trabajo
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard/maestros">← Cancelar</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* CONTENIDO - MISMO ESTILO QUE NUEVA COTIZACIÓN */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={guardarMaestro}>
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            
            <h2 className="text-lg font-semibold text-gray-900">Información del Maestro</h2>

            {/* NOMBRE */}
            <div>
              <Label className="text-gray-900">Nombre Completo *</Label>
              <Input
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Juan Pérez"
                className="mt-2"
                required
              />
            </div>

            {/* TELÉFONO */}
            <div>
              <Label className="text-gray-900">Teléfono / WhatsApp *</Label>
              <Input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="Ej: 0987654321"
                className="mt-2"
                required
              />
            </div>

            {/* CI */}
            <div>
              <Label className="text-gray-900">Cédula de Identidad</Label>
              <Input
                value={formData.ci}
                onChange={(e) => setFormData({ ...formData, ci: e.target.value })}
                placeholder="Ej: 1234567890 (opcional)"
                className="mt-2"
              />
            </div>

            {/* ESPECIALIDADES */}
            <div>
              <Label className="text-gray-900">Especialidades</Label>
              <Input
                value={formData.especialidades}
                onChange={(e) => setFormData({ ...formData, especialidades: e.target.value })}
                placeholder="Ej: Plomería, Electricidad, Pintura"
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separa cada especialidad con comas
              </p>
            </div>

            {/* CUENTA BANCARIA */}
            <div>
              <Label className="text-gray-900">Cuenta Bancaria</Label>
              <Input
                value={formData.cuentaBanco}
                onChange={(e) => setFormData({ ...formData, cuentaBanco: e.target.value })}
                placeholder="Ej: Banco Pichincha - 1234567890"
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Para realizar pagos al maestro
              </p>
            </div>

            {/* BOTÓN GUARDAR */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={guardando}
                className="w-full"
                size="lg"
              >
                {guardando ? '⏳ Guardando...' : '💾 Crear Maestro'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}