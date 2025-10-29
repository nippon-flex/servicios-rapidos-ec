'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LeadData {
  id: string
  codigo: string
  clienteNombre: string
  service: {
    nombre: string
    precioBase: number
  }
}

interface Item {
  tipo: string
  descripcion: string
  cantidad: number
  precioUnitario: number
  total: number
}

export default function NuevaCotizacionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const leadId = searchParams.get('leadId')

  const [lead, setLead] = useState<LeadData | null>(null)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Item[]>([
    {
      tipo: 'SERVICIO',
      descripcion: '',
      cantidad: 1,
      precioUnitario: 0,
      total: 0,
    },
  ])
  const [aplicarIVA, setAplicarIVA] = useState(false)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (!leadId) {
      alert('No se especificó un lead')
      router.push('/dashboard/leads')
      return
    }

    fetch(`/api/leads/${leadId}`)
      .then((res) => res.json())
      .then((data) => {
        setLead(data)
        setItems([
          {
            tipo: 'SERVICIO',
            descripcion: data.service.nombre,
            cantidad: 1,
            precioUnitario: Number(data.service.precioBase),
            total: Number(data.service.precioBase),
          },
        ])
      })
      .catch((err) => {
        console.error('Error:', err)
        alert('Error cargando lead')
      })
      .finally(() => setLoading(false))
  }, [leadId, router])

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const impuesto = aplicarIVA ? subtotal * 0.15 : 0
  const total = subtotal + impuesto
  const anticipo = total * 0.3
  const saldo = total * 0.7

  const agregarItem = () => {
    setItems([
      ...items,
      {
        tipo: 'MATERIAL',
        descripcion: '',
        cantidad: 1,
        precioUnitario: 0,
        total: 0,
      },
    ])
  }

  const actualizarItem = (index: number, campo: string, valor: any) => {
    const nuevosItems = [...items]
    nuevosItems[index] = {
      ...nuevosItems[index],
      [campo]: valor,
    }

    if (campo === 'cantidad' || campo === 'precioUnitario') {
      nuevosItems[index].total =
        nuevosItems[index].cantidad * nuevosItems[index].precioUnitario
    }

    setItems(nuevosItems)
  }

  const eliminarItem = (index: number) => {
    if (items.length === 1) {
      alert('Debe haber al menos un item')
      return
    }
    setItems(items.filter((_, i) => i !== index))
  }

  const guardarCotizacion = async () => {
    if (items.some((item) => !item.descripcion || item.precioUnitario <= 0)) {
      alert('Completa todos los items')
      return
    }

    setGuardando(true)

    try {
      const response = await fetch('/api/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          items: items.map((item, idx) => ({
            ...item,
            orden: idx,
          })),
          aplicarIVA,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(`✅ Cotización ${data.quote.codigo} creada!`)
        window.location.href = `/dashboard/cotizaciones/${data.quote.id}`
      } else {
        alert('Error: ' + data.error)
      }
    } catch (err) {
      alert('Error guardando cotización')
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

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-gray-600">Lead no encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Nueva Cotización
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Para: {lead.clienteNombre} - {lead.service.nombre} ({lead.codigo})
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/leads/${leadId}`)}
            >
              ← Cancelar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Items</h2>
              <Button onClick={agregarItem} variant="outline" size="sm">
                + Agregar Item
              </Button>
            </div>

            {items.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Item {index + 1}
                  </span>
                  {items.length > 1 && (
                    <button
                      onClick={() => eliminarItem(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      🗑️ Eliminar
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <Label>Descripción</Label>
                    <Input
                      value={item.descripcion}
                      onChange={(e) =>
                        actualizarItem(index, 'descripcion', e.target.value)
                      }
                      placeholder="Ej: Reparación de tubería"
                    />
                  </div>

                  <div>
                    <Label>Cantidad</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) =>
                        actualizarItem(
                          index,
                          'cantidad',
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>

                  <div>
                    <Label>Precio Unit.</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.precioUnitario}
                      onChange={(e) =>
                        actualizarItem(
                          index,
                          'precioUnitario',
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-gray-500">Total del item:</span>
                  <span className="font-semibold text-gray-900">
                    ${item.total.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mb-6">
            <div>
              <p className="font-medium text-gray-900">Aplicar IVA (15%)</p>
              <p className="text-sm text-gray-500">
                Activa si el cliente requiere factura
              </p>
            </div>
            <button
              onClick={() => setAplicarIVA(!aplicarIVA)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                aplicarIVA ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  aplicarIVA ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-base">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold text-gray-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            {aplicarIVA && (
              <div className="flex justify-between text-base">
                <span className="text-gray-600">IVA (15%):</span>
                <span className="font-semibold text-gray-900">
                  ${impuesto.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold border-t pt-2">
              <span className="text-gray-900">TOTAL:</span>
              <span className="text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4 bg-blue-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Anticipo (30%):</span>
              <span className="font-semibold text-gray-900">
                ${anticipo.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Saldo (70%):</span>
              <span className="font-semibold text-gray-900">
                ${saldo.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={guardarCotizacion}
              disabled={guardando}
              className="w-full"
              size="lg"
            >
              {guardando ? 'Guardando...' : '💾 Guardar Cotización'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}