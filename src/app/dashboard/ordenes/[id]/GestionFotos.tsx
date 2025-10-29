'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  ordenId: string
  fotosAntes: string[]
  fotosDurante: string[]
  fotosDespues: string[]
}

export default function GestionFotos({ ordenId, fotosAntes, fotosDurante, fotosDespues }: Props) {
  const router = useRouter()
  const [guardando, setGuardando] = useState(false)
  const [categoria, setCategoria] = useState<'antes' | 'durante' | 'despues'>('antes')
  const [nuevaUrl, setNuevaUrl] = useState('')

  const agregarFoto = async () => {
    if (!nuevaUrl.trim()) {
      alert('❌ Ingresa una URL válida')
      return
    }

    try {
      new URL(nuevaUrl)
    } catch {
      alert('❌ URL inválida. Debe comenzar con http:// o https://')
      return
    }

    setGuardando(true)

    try {
      const campo = categoria === 'antes' ? 'fotosAntes' : 
                    categoria === 'durante' ? 'fotosDurante' : 'fotosDespues'
      
      const fotosActuales = categoria === 'antes' ? fotosAntes : 
                           categoria === 'durante' ? fotosDurante : fotosDespues

      const response = await fetch(`/api/ordenes/${ordenId}/fotos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campo,
          fotos: [...fotosActuales, nuevaUrl.trim()],
        }),
      })

      if (response.ok) {
        alert('✅ Foto agregada correctamente')
        setNuevaUrl('')
        router.refresh()
      } else {
        alert('❌ Error al agregar foto')
      }
    } catch (err) {
      alert('❌ Error al guardar')
    } finally {
      setGuardando(false)
    }
  }

  const eliminarFoto = async (categoria: 'antes' | 'durante' | 'despues', index: number) => {
    if (!confirm('¿Eliminar esta foto?')) return

    setGuardando(true)

    try {
      const campo = categoria === 'antes' ? 'fotosAntes' : 
                    categoria === 'durante' ? 'fotosDurante' : 'fotosDespues'
      
      const fotosActuales = categoria === 'antes' ? fotosAntes : 
                           categoria === 'durante' ? fotosDurante : fotosDespues

      const nuevasFotos = fotosActuales.filter((_, i) => i !== index)

      const response = await fetch(`/api/ordenes/${ordenId}/fotos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campo,
          fotos: nuevasFotos,
        }),
      })

      if (response.ok) {
        alert('✅ Foto eliminada')
        router.refresh()
      } else {
        alert('❌ Error al eliminar')
      }
    } catch (err) {
      alert('❌ Error')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">📸 Fotos del Trabajo</h2>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="mb-3">
          <label className="text-sm font-medium text-gray-900 mb-2 block">
            Categoría:
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCategoria('antes')}
              className={`px-4 py-2 rounded text-sm font-medium ${
                categoria === 'antes'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700'
              }`}
            >
              Antes
            </button>
            <button
              type="button"
              onClick={() => setCategoria('durante')}
              className={`px-4 py-2 rounded text-sm font-medium ${
                categoria === 'durante'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700'
              }`}
            >
              Durante
            </button>
            <button
              type="button"
              onClick={() => setCategoria('despues')}
              className={`px-4 py-2 rounded text-sm font-medium ${
                categoria === 'despues'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700'
              }`}
            >
              Después
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            value={nuevaUrl}
            onChange={(e) => setNuevaUrl(e.target.value)}
            placeholder="https://i.imgur.com/ejemplo.jpg"
            className="flex-1"
          />
          <Button
            onClick={agregarFoto}
            disabled={guardando}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {guardando ? '⏳...' : '+ Agregar'}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Tip: Sube tu foto a <a href="https://imgur.com/upload" target="_blank" className="text-blue-600 underline">Imgur</a> y copia el enlace
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">📷 Antes del Trabajo</h3>
          {fotosAntes.length === 0 ? (
            <p className="text-sm text-gray-400">Sin fotos</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {fotosAntes.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt={`Antes ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => eliminarFoto('antes', idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">🔧 Durante el Trabajo</h3>
          {fotosDurante.length === 0 ? (
            <p className="text-sm text-gray-400">Sin fotos</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {fotosDurante.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt={`Durante ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => eliminarFoto('durante', idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">✅ Después del Trabajo</h3>
          {fotosDespues.length === 0 ? (
            <p className="text-sm text-gray-400">Sin fotos</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {fotosDespues.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    alt={`Después ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => eliminarFoto('despues', idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}