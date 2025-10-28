import { NextResponse } from 'next/server'
import { generarMensajeWhatsApp } from '@/lib/openai'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tipo, datos } = body

    // Validar que tenemos los datos necesarios
    if (!tipo || !datos) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Generar mensaje con IA
    const mensaje = await generarMensajeWhatsApp(tipo, datos)

    return NextResponse.json({ mensaje })
  } catch (error) {
    console.error('Error generando mensaje:', error)
    return NextResponse.json(
      { error: 'Error al generar mensaje' },
      { status: 500 }
    )
  }
}