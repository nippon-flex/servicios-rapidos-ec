'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface Props {
  ordenId: string
  tipo: 'ANTICIPO' | 'SALDO'
  montoSugerido: number
}

export default function RegistrarPagoButton({ ordenId, tipo, montoSugerido }: Props) {
  const router = useRouter()
  const [registrando, setRegistrando] = useState(false)

  const registrarPago = async () => {
    const monto = prompt(
      `Registrar ${tipo}\n\nMonto sugerido: $${montoSugerido.toFixed(2)}\n\nIngresa el monto recibido:`,
      montoSugerido.toFixed(2)
    )

    if (!monto) return

    const metodo = prompt(
      'Método de pago:\n\n1. TRANSFERENCIA\n2. EFECTIVO\n3. OTRO\n\nEscribe el número:',
      '1'
    )

    let metodoFinal = 'TRANSFERENCIA'
    if (metodo === '2') metodoFinal = 'EFECTIVO'
    if (metodo === '3') metodoFinal = 'OTRO'

    const referencia = prompt('Referencia o número de comprobante (opcional):') || ''

    setRegistrando(true)

    try {
      const response = await fetch('/api/pagos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: ordenId,
          tipo,
          metodo: metodoFinal,
          monto: parseFloat(monto),
          referencia,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(
          `✅ Pago registrado!\n\nTipo: ${tipo}\nMonto: $${parseFloat(monto).toFixed(2)}\nNuevo estado: ${data.nuevoEstado}`
        )
        router.refresh()
      } else {
        alert('❌ Error: ' + data.error)
      }
    } catch (err) {
      alert('❌ Error al registrar pago')
    } finally {
      setRegistrando(false)
    }
  }

  return (
    <Button
      onClick={registrarPago}
      disabled={registrando}
      className={`w-full ${
        tipo === 'ANTICIPO' 
          ? 'bg-blue-600 hover:bg-blue-700' 
          : 'bg-orange-600 hover:bg-orange-700'
      }`}
      size="lg"
    >
      {registrando
        ? '⏳ Registrando...'
        : tipo === 'ANTICIPO'
        ? '💳 Registrar Anticipo'
        : '💰 Registrar Saldo Final'}
    </Button>
  )
}