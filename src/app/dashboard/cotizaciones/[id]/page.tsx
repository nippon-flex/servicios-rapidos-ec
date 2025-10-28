'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface QuoteData {
  id: string
  codigo: string
  subtotal: string | number
  impuesto: string | number
  total: string | number
  anticipo: string | number
  saldo: string | number
  validezDias: number
  fechaExpira: string
  estado: string
  items: Array<{
    id: string
    tipo: string
    descripcion: string
    cantidad: string | number
    precioUnitario: string | number
    total: string | number
  }>
  lead: {
    id: string
    codigo: string
    clienteNombre: string
    clienteTelefono: string
    direccion: string
    service: {
      nombre: string
    }
  }
}

export default function CotizacionDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [quoteId, setQuoteId] = useState<string | null>(null)
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generandoMensaje, setGenerandoMensaje] = useState(false)
  const [mensajeIA, setMensajeIA] = useState<string | null>(null)

  useEffect(() => {
    params.then(({ id }) => {
      setQuoteId(id)
      // Cargar cotización
      fetch(`/api/cotizaciones/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setQuote(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error(err)
          setLoading(false)
        })
    })
  }, [params])

  const generarMensaje = async () => {
    if (!quote) return

    setGenerandoMensaje(true)
    try {
      const response = await fetch('/api/generar-mensaje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: 'cotizacion',
          datos: {
            clienteNombre: quote.lead.clienteNombre,
            servicio: quote.lead.service.nombre,
            total: Number(quote.total).toFixed(2),
            anticipo: Number(quote.anticipo).toFixed(2),
            saldo: Number(quote.saldo).toFixed(2),
            codigo: quote.codigo,
            validezDias: quote.validezDias,
          },
        }),
      })

      const data = await response.json()
      setMensajeIA(data.mensaje)
    } catch (err) {
      alert('Error generando mensaje')
    } finally {
      setGenerandoMensaje(false)
    }
  }

  const abrirWhatsApp = () => {
    if (!quote || !mensajeIA) return
    const phone = quote.lead.clienteTelefono.replace(/[^0-9]/g, '')
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(mensajeIA)}`
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-4xl">⏳</div>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-gray-600">Cotización no encontrada</p>
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
              <h1 className="text-2xl font-bold text-gray-900">{quote.codigo}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Para: {quote.lead.clienteNombre} - {quote.lead.service.nombre}
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href={`/dashboard/leads/${quote.lead.id}`} className="text-gray-700">
                ← Volver al Lead
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMNA PRINCIPAL */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* ITEMS */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
              <div className="space-y-3">
                {quote.items.map((item, idx) => (
                  <div key={item.id} className="flex justify-between border-b pb-3">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{idx + 1}. {item.descripcion}</p>
                      <p className="text-sm text-gray-500">
                        {Number(item.cantidad)} × ${Number(item.precioUnitario).toFixed(2)}
                      </p>
                    </div>
                    <div className="font-semibold text-gray-900">
                      ${Number(item.total).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* TOTALES */}
              <div className="mt-6 space-y-2 border-t pt-4">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">${Number(quote.subtotal).toFixed(2)}</span>
                </div>
                {Number(quote.impuesto) > 0 && (
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">IVA (15%):</span>
                    <span className="font-semibold text-gray-900">${Number(quote.impuesto).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span className="text-gray-900">TOTAL:</span>
                  <span className="text-blue-600">${Number(quote.total).toFixed(2)}</span>
                </div>
              </div>

              {/* ANTICIPO Y SALDO */}
              <div className="mt-4 bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Anticipo (30%):</span>
                  <span className="font-semibold text-gray-900">${Number(quote.anticipo).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Saldo (70%):</span>
                  <span className="font-semibold text-gray-900">${Number(quote.saldo).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA LATERAL */}
          <div className="space-y-6">
            
            {/* ACCIONES */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Acciones</h3>
              
              {!mensajeIA ? (
                <Button
                  onClick={generarMensaje}
                  disabled={generandoMensaje}
                  className="w-full"
                  size="lg"
                >
                  {generandoMensaje ? 'Generando...' : '🤖 Generar Mensaje IA'}
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-gray-50 border border-gray-200 rounded p-4 max-h-64 overflow-y-auto">
                    <p className="text-sm whitespace-pre-wrap text-gray-700">{mensajeIA}</p>
                  </div>
                  <Button
                    onClick={abrirWhatsApp}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    📱 Enviar por WhatsApp
                  </Button>
                  <Button
                    onClick={generarMensaje}
                    variant="outline"
                    className="w-full"
                  >
                    🔄 Regenerar
                  </Button>
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="bg-gray-50 rounded-lg border p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">ℹ️ Información</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Estado:</span>
                  <span className="ml-2 font-medium text-gray-900">{quote.estado}</span>
                </div>
                <div>
                  <span className="text-gray-500">Validez:</span>
                  <span className="ml-2 font-medium text-gray-900">{quote.validezDias} días</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}