'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function RegistrarGarantiaForm({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [motivo, setMotivo] = useState('')
  const [fotos, setFotos] = useState([''])
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    setError('')
    setStatus('')
    
    try {
      const res = await fetch('/api/garantias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          clienteReporte: motivo,
          fotos: fotos.filter(Boolean),
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Error al registrar garantía')
      }

      const data = await res.json()
      setStatus(`¡Garantía registrada! Código: ${data.codigo}`)
      setMotivo('')
      setFotos([''])
      
      // Recargar datos del servidor
      setTimeout(() => {
        router.refresh()
      }, 2000)
      
    } catch (err: any) {
      setError(err.message || 'Hubo un problema. Revisa los datos.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Motivo de la garantía *
        </label>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          rows={4}
          required
          placeholder="Describe el problema reportado por el cliente..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URLs de Fotos (opcional, una por línea)
        </label>
        <textarea
          value={fotos.join('\n')}
          onChange={(e) => setFotos(e.target.value.split('\n'))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          rows={3}
          placeholder="https://ejemplo.com/foto1.jpg&#10;https://ejemplo.com/foto2.jpg"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          ❌ {error}
        </div>
      )}

      {status && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          ✅ {status}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-yellow-600 hover:bg-yellow-700"
        disabled={enviando}
      >
        {enviando ? '⏳ Registrando...' : '🛡️ Registrar Garantía'}
      </Button>
    </form>
  )
}