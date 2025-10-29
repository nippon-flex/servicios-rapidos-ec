'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface Maestro {
  id: string
  nombre: string
  telefono: string
  especialidades: string[]
  ordenesAsignadas: any[]
}

interface Props {
  ordenId: string
  maestroActual: { id: string; nombre: string } | null
}

export default function AsignarMaestroButton({ ordenId, maestroActual }: Props) {
  const router = useRouter()
  const [maestros, setMaestros] = useState<Maestro[]>([])
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    fetch('/api/maestros')
      .then((res) => res.json())
      .then((data) => {
        const activos = data.maestros.filter((m: Maestro) => m.activo)
        setMaestros(activos)
      })
      .catch((err) => console.error('Error cargando maestros:', err))
  }, [])

  const asignarMaestro = async () => {
    if (maestros.length === 0) {
      alert('❌ No hay maestros activos registrados.\n\nCrea un maestro primero en la sección de Maestros.')
      return
    }

    // Crear mensaje con lista de maestros
    let mensaje = 'Selecciona el maestro a asignar:\n\n'
    maestros.forEach((m, idx) => {
      mensaje += `${idx + 1}. ${m.nombre}\n`
      if (m.especialidades && m.especialidades.length > 0) {
        mensaje += `   Especialidades: ${m.especialidades.join(', ')}\n`
      }
      mensaje += `   Órdenes activas: ${m.ordenesAsignadas.filter(o => !['CERRADA', 'CANCELADA'].includes(o.estado)).length}\n\n`
    })
    mensaje += '\nEscribe el número del maestro:'

    const seleccion = prompt(mensaje)

    if (!seleccion) return

    const indice = parseInt(seleccion) - 1

    if (indice < 0 || indice >= maestros.length) {
      alert('❌ Número inválido')
      return
    }

    const maestroSeleccionado = maestros[indice]

    if (!confirm(`¿Confirmas asignar a ${maestroSeleccionado.nombre}?`)) {
      return
    }

    setCargando(true)

    try {
      const response = await fetch(`/api/ordenes/${ordenId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maestroId: maestroSeleccionado.id,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(`✅ Maestro ${maestroSeleccionado.nombre} asignado correctamente`)
        router.refresh()
      } else {
        alert('❌ Error: ' + data.error)
      }
    } catch (err) {
      alert('❌ Error al asignar maestro')
    } finally {
      setCargando(false)
    }
  }

  const removerMaestro = async () => {
    if (!confirm('¿Confirmas remover la asignación del maestro?')) {
      return
    }

    setCargando(true)

    try {
      const response = await fetch(`/api/ordenes/${ordenId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maestroId: null,
        }),
      })

      if (response.ok) {
        alert('✅ Maestro removido de la orden')
        router.refresh()
      } else {
        alert('❌ Error al remover maestro')
      }
    } catch (err) {
      alert('❌ Error al remover maestro')
    } finally {
      setCargando(false)
    }
  }

  if (maestroActual) {
    return (
      <div className="space-y-3">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-800 mb-2">
            ✅ Maestro Asignado
          </div>
          <div className="font-semibold text-green-900">
            {maestroActual.nombre}
          </div>
        </div>
        <Button
          onClick={removerMaestro}
          disabled={cargando}
          variant="outline"
          className="w-full"
        >
          {cargando ? '⏳ Removiendo...' : '❌ Remover Asignación'}
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
      <div className="text-sm text-orange-800 mb-3">
        ⚠️ Sin maestro asignado
      </div>
      <Button
        onClick={asignarMaestro}
        disabled={cargando}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {cargando ? '⏳ Asignando...' : '👷 Asignar Maestro'}
      </Button>
    </div>
  )
}