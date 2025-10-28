'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

// Tipos
interface QuoteItem {
  id: string
  tipo: 'MANO_OBRA' | 'MATERIAL' | 'VISITA' | 'URGENCIA' | 'OTRO'
  descripcion: string
  cantidad: number
  precioUnitario: number
  total: number
}

interface Lead {
  id: string
  codigo: string
  clienteNombre: string
  clienteTelefono: string
  service: {
    nombre: string
    precioBase: number
  }
}

export default function NuevaCotizacionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const leadId = searchParams.get('leadId')

  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Items de la cotización
  const [items, setItems] = useState<QuoteItem[]>([
    {
      id: '1',
      tipo: 'MANO_OBRA',
      descripcion: 'Mano de obra',
      cantidad: 1,
      precioUnitario: 0,
      total: 0,
    },
  ])

  // Switch de IVA
  const [aplicarIva, setAplicarIva] = useState(false)

  // Cálculos - asegurar que siempre sean números
  const subtotal = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0)
  const iva = aplicarIva ? subtotal * 0.15 : 0
  const total = subtotal + iva
  const anticipo = total * 0.30
  const saldo = total - anticipo

  // Cargar datos del lead
  useEffect(() => {
    if (!leadId) {
      setLoading(false)
      return
    }

    fetch(`/api/leads/${leadId}`)
      .then((res) => res.json())
      .then((data) => {
        setLead(data)
        // Pre-llenar con precio base del servicio
        setItems([
          {
            id: '1',
            tipo: 'MANO_OBRA',
            descripcion: `Mano de obra - ${data.service.nombre}`,
            cantidad: 1,
            precioUnitario: Number(data.service.precioBase) || 0,
            total: Number(data.service.precioBase) || 0,
          },
        ])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [leadId])

  // Agregar nuevo item
  const agregarItem = () => {
    const nuevoId = (items.length + 1).toString()
    setItems([
      ...items,
      {
        id: nuevoId,
        tipo: 'MATERIAL',
        descripcion: '',
        cantidad: 1,
        precioUnitario: 0,
        total: 0,
      },
    ])
  }

  // Eliminar item
  const eliminarItem = (id: string) => {
    if (items.length === 1) {
      alert('Debe haber al menos un item')
      return
    }
    setItems(items.filter((item) => item.id !== id))
  }

  // Actualizar item
  const actualizarItem = (id: string, campo: keyof QuoteItem, valor: any) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item
        
        const updated = { ...item, [campo]: valor }
        
        // Recalcular total si cambió cantidad o precio
        if (campo === 'cantidad' || campo === 'precioUnitario') {
          const cantidad = campo === 'cantidad' ? valor : updated.cantidad
          const precio = campo === 'precioUnitario' ? valor : updated.precioUnitario
          updated.total = Number(cantidad || 0) * Number(precio || 0)
        }
        
        return updated
      })
    )
  }

  // Guardar cotización
  const guardarCotizacion = async () => {
    if (!leadId) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          items,
          aplicarIva,
          subtotal,
          impuesto: iva,
          total,
          anticipo,
          saldo,
        }),
      })

      if (!response.ok) throw new Error('Error al guardar')

      const data = await response.json()
      alert('✅ Cotización creada exitosamente')
      router.push(`/dashboard/leads/${leadId}`)
    } catch (err) {
      alert('❌ Error al guardar cotización')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-gray-600 mb-4">Lead no encontrado</p>
          <Button asChild>
            <Link href="/dashboard/leads">Volver a Leads</Link>
          </Button>
        </div>
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
              <h1 className="text-2xl font-bold text-gray-900">
                📋 Nueva Cotización
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Para: <span className="font-semibold">{lead.clienteNombre}</span> - {lead.service.nombre}
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href={`/dashboard/leads/${leadId}`}>← Volver</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          
          {/* ITEMS */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items de la Cotización</h3>
            
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  {/* Número del item */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">Item {index + 1}</span>
                    {items.length > 1 && (
                      <button
                        onClick={() => eliminarItem(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        ❌ Eliminar
                      </button>
                    )}
                  </div>

                  {/* Tipo */}
                  <div>
                    <Label>Tipo</Label>
                    <select
                      value={item.tipo}
                      onChange={(e) => actualizarItem(item.id, 'tipo', e.target.value)}
                      className="mt-1 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                    >
                      <option value="MANO_OBRA">Mano de obra</option>
                      <option value="MATERIAL">Material</option>
                      <option value="VISITA">Visita técnica</option>
                      <option value="URGENCIA">Cargo por urgencia</option>
                      <option value="OTRO">Otro</option>
                    </select>
                  </div>

                  {/* Descripción */}
                  <div>
                    <Label>Descripción</Label>
                    <Input
                      value={item.descripcion}
                      onChange={(e) => actualizarItem(item.id, 'descripcion', e.target.value)}
                      placeholder="Ej: Reparación de tubería"
                      className="mt-1"
                    />
                  </div>

                  {/* Cantidad y Precio */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Cantidad</Label>
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.cantidad}
                        onChange={(e) => actualizarItem(item.id, 'cantidad', parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Precio Unit.</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.precioUnitario}
                        onChange={(e) => actualizarItem(item.id, 'precioUnitario', parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Total</Label>
                      <Input
                        type="text"
                        value={`$${(Number(item.total) || 0).toFixed(2)}`}
                        readOnly
                        className="mt-1 bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Botón Agregar Item */}
            <button
              onClick={agregarItem}
              className="mt-4 w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-600 hover:border-blue-500 hover:text-blue-600 font-medium transition-colors"
            >
              + Agregar otro item
            </button>
          </div>

          {/* RESUMEN */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h3>
            
            <div className="space-y-3">
              {/* Subtotal */}
              <div className="flex justify-between text-base">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>

              {/* Switch IVA */}
              <div className="flex items-center justify-between py-3 bg-gray-50 px-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="aplicar-iva"
                    checked={aplicarIva}
                    onChange={(e) => setAplicarIva(e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="aplicar-iva" className="cursor-pointer text-base">
                    Aplicar IVA (15%)
                  </Label>
                </div>
                <span className="font-semibold">${iva.toFixed(2)}</span>
              </div>

              {/* Total */}
              <div className="flex justify-between text-xl font-bold border-t border-gray-300 pt-3">
                <span>TOTAL:</span>
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </div>

              {/* Anticipo y Saldo */}
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Anticipo (30%):</span>
                  <span className="font-semibold text-gray-900">${anticipo.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Saldo (70%):</span>
                  <span className="font-semibold text-gray-900">${saldo.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <Button
              onClick={guardarCotizacion}
              disabled={saving || subtotal === 0}
              size="lg"
              className="flex-1"
            >
              {saving ? 'Guardando...' : '💾 Guardar Cotización'}
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/dashboard/leads/${leadId}`}>Cancelar</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}