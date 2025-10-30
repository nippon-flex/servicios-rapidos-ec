'use client'
import { useState } from 'react'

export default function RegistrarGarantiaForm({ orderId, onRegistrada }) {
  const [motivo, setMotivo] = useState('')
  const [fotos, setFotos] = useState([''])
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)
    setError('')
    try {
      const res = await fetch('/api/warranty-cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          clienteReporte: motivo,
          fotos: fotos.filter(Boolean),
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      setStatus('¡Garantía registrada correctamente!')
      setMotivo('')
      setFotos([''])
      if (onRegistrada) onRegistrada()
    } catch (err) {
      setError('Hubo un problema. Revisa los datos.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white mt-4">
      <div>
        <label className="block font-bold mb-2">Motivo de la garantía</label>
        <textarea value={motivo} onChange={e => setMotivo(e.target.value)}
          className="w-full p-2 border rounded" required />
      </div>
      <div>
        <label className="block font-bold mb-2">Fotos (URL, una por línea)</label>
        <textarea value={fotos.join('\n')}
          onChange={e => setFotos(e.target.value.split('\n'))}
          className="w-full p-2 border rounded"
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {status && <div className="text-green-500">{status}</div>}
      <button type="submit"
        className="bg-yellow-500 text-white px-4 py-2 rounded font-bold" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Registrar Garantía'}
      </button>
    </form>
  )
}
