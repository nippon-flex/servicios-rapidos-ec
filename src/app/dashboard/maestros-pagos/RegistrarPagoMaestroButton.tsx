'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface Props {
  maestro: {
    id: string
    nombre: string
  }
  pendiente: number
}

export default function RegistrarPagoMaestroButton({ maestro, pendiente }: Props) {
  const router = useRouter()
  const [registrando, setRegistrando] = useState(false)

  const registrarPago = async () => {
    const monto = prompt(
      `Registrar pago a ${maestro.nombre}\n\nPendiente: $${pendiente.toFixed(2)}\n\nIngresa el monto a pagar:`,
      pendiente.toFixed(2)
    )

    if (!monto) return

    const montoNum = parseFloat(monto)

    if (montoNum <= 0 || isNaN(montoNum)) {
      alert('❌ Monto inválido')
      return
    }

    if (montoNum > pendiente) {
      if (!confirm(`El monto ($${montoNum.toFixed(2)}) es mayor al pendiente ($${pendiente.toFixed(2)}).\n\n¿Deseas continuar?`)) {
        return
      }
    }

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
      const response = await fetch('/api/maestros-pagos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maestroId: maestro.id,
          monto: montoNum,
          metodo: metodoFinal,
          referencia,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(`✅ Pago de $${montoNum.toFixed(2)} registrado a ${maestro.nombre}`)
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
      size="sm"
      className="bg-green-600 hover:bg-green-700"
    >
      {registrando ? '⏳...' : '💰 Pagar'}
    </Button>
  )
}