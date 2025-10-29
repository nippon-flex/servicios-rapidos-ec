'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

type Maestro = {
  id: string
  nombre: string
  telefono: string
  especialidades: string[]
  activo: boolean
}

export default function AsignarMaestroButton({
  ordenId,
  maestroActual,
  onAsignado,
}: {
  ordenId: string
  maestroActual?: { id: string; nombre: string } | null
  onAsignado: () => void
}) {
  const [maestros, setMaestros] = useState<Maestro[]>([])
  const [mostrar, setMostrar] = useState(false)
  const [asignando, setAsignando] = useState(false)

  useEffect(() => {
    if (mostrar) {
      fetch('/api/maestros')
        .then((res) => res.json())
        .then((data) => {
          const activos = data.maestros.filter((m: Maestro) => m.activo)
          setMaestros(activos)
        })
        .catch((err) => console.error('Error cargando maestros:', err))
    }
  }, [mostrar])

  const asignar = async (maestroId: string) => {
    setAsignando(true)
    try {
      const res = await fetch(`/api/ordenes/${ordenId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maestroId }),
      })
      if (res.ok) {
        onAsignado()
        setMostrar(false)
      }
    } catch (error) {
      console.error('Error asignando maestro:', error)
    } finally {
      setAsignando(false)
    }
  }

  const remover = async () => {
    setAsignando(true)
    try {
      const res = await fetch(`/api/ordenes/${ordenId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maestroId: null }),
      })
      if (res.ok) {
        onAsignado()
      }
    } catch (error) {
      console.error('Error removiendo maestro:', error)
    } finally {
      setAsignando(false)
    }
  }

  return (
    <div className="space-y-2">
      {maestroActual ? (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded">
          <span className="text-green-700 font-medium">
            Asignado: {maestroActual.nombre}
          </span>
          <Button
            onClick={remover}
            variant="outline"
            size="sm"
            disabled={asignando}
          >
            {asignando ? 'Removiendo...' : 'Remover'}
          </Button>
        </div>
      ) : (
        <Button onClick={() => setMostrar(!mostrar)} variant="outline">
          {mostrar ? 'Cancelar' : '👷 Asignar Maestro'}
        </Button>
      )}

      {mostrar && (
        <div className="grid gap-2 p-4 bg-gray-50 border rounded">
          <p className="font-medium">Maestros disponibles:</p>
          {maestros.length === 0 ? (
            <p className="text-gray-500">No hay maestros activos</p>
          ) : (
            maestros.map((m) => (
              <div
                key={m.id}
                className="flex justify-between items-center p-2 bg-white border rounded hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{m.nombre}</p>
                  <p className="text-sm text-gray-600">{m.telefono}</p>
                  <p className="text-xs text-gray-500">
                    {m.especialidades.join(', ')}
                  </p>
                </div>
                <Button
                  onClick={() => asignar(m.id)}
                  disabled={asignando}
                  size="sm"
                >
                  {asignando ? 'Asignando...' : 'Asignar'}
                </Button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}