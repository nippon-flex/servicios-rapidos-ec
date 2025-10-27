'use client'

import { useState } from 'react'

export default function TestAIPage() {
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)

  const probarIA = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-ai', {
        method: 'POST',
      })
      const data = await response.json()
      setMensaje(data.mensaje)
    } catch (error) {
      setMensaje('Error: ' + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🤖 Prueba de IA - OpenAI</h1>
        
        <button
          onClick={probarIA}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Generando mensaje...' : '✨ Generar Mensaje de Cotización'}
        </button>

        {mensaje && (
          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <h2 className="font-semibold mb-2">Mensaje generado:</h2>
            <p className="whitespace-pre-wrap text-gray-700">{mensaje}</p>
          </div>
        )}
      </div>
    </div>
  )
}