import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { quoteId, maestroId, costoMaestro } = body

    // Validar cotización
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: { lead: true },
    })

    if (!quote) {
      return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 })
    }

    if (quote.estado !== 'APROBADA') {
      return NextResponse.json({ error: 'La cotización debe estar aprobada' }, { status: 400 })
    }

    // Generar código
    const count = await prisma.order.count({
      where: { regionId: quote.regionId },
    })
    const codigo = `OR-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(count + 1).padStart(4, '0')}`

    // Calcular margen
    const margen = Number(quote.total) - Number(costoMaestro || 0)

    // Crear orden
    const order = await prisma.order.create({
      data: {
        codigo,
        quoteId,
        regionId: quote.regionId,
        maestroId: maestroId || null,
        costoMaestro: costoMaestro || 0,
        margen,
        estado: 'ANTICIPO_PENDIENTE',
        fotosAntes: [],
        fotosDurante: [],
        fotosDespues: [],
      },
    })

    // Actualizar cotización
    await prisma.quote.update({
      where: { id: quoteId },
      data: { estado: 'CONVERTIDA' },
    })

    // Actualizar lead
    await prisma.lead.update({
      where: { id: quote.leadId },
      data: { estado: 'CONVERTIDO' },
    })

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Error creando orden:', error)
    return NextResponse.json({ error: 'Error al crear orden' }, { status: 500 })
  }
}