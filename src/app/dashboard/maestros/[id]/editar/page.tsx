'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function EditarMaestroPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    ci: '',
    especialidades: '',
    cuentaBanco: '',
    activo: true,
  })

  useEffect(() => {
    fetch(`/api/maestros/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          nombre: data.nombre || '',
          telefono: data.telefono || '',
          ci: data.ci || '',
          especialidades: data.especialidades?.join(', ') || '',
          cuentaBanco: data.cuentaBanco || '',
          activo: data.activo,
        })
      })
      .catch((err) => {
        console.error('Error:', err)
        alert('Error cargando maestro')
      })
      .finally(() => setLoading(false))
  }, [id])

  const guardarCambios = async (e: React.FormEvent) => {
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

      const response = await fetch(`/api/maestros/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          telefono: formData.telefono.trim(),
          ci: formData.ci.trim() || null,
          especialidades: especialidadesArray,
          cuentaBanco: formData.cuentaBanco.trim() || null,
          activo: formData.activo,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('✅ Maestro actualizado exitosamente')
        router.push(`/dashboard/maestros/${id}`)
      } else {
        alert('❌ Error: ' + data.error)
      }
    } catch (err) {
      alert('❌ Error al actualizar maestro')
    } finally {
      setGuardando(false)
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
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Maestro</h1>
              <p className="mt-1 text-sm text-gray-500">
                Actualiza la información del maestro
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href={`/dashboard/maestros/${id}`}>← Cancelar</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* FORMULARIO */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={guardarCambios}>
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
                placeholder="Ej: 1234567890"
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
            </div>

            {/* ESTADO ACTIVO/INACTIVO */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Estado del Maestro</p>
                <p className="text-sm text-gray-500">
                  {formData.activo
                    ? 'El maestro puede recibir órdenes'
                    : 'El maestro no recibirá nuevas órdenes'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, activo: !formData.activo })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.activo ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.activo ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* BOTONES */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={guardando}
                className="flex-1"
                size="lg"
              >
                {guardando ? '⏳ Guardando...' : '💾 Guardar Cambios'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/dashboard/maestros/${id}`)}
                className="flex-1"
                size="lg"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}