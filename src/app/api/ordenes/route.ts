import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Obtener todas las órdenes
export async function GET() {
  try {
    const ordenes = await prisma.order.findMany({
      include: {
        quote: {
          include: {
            lead: {
              include: {
                service: true,
              },
            },
          },
        },
        maestro: true,
        pagos: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ ordenes })
  } catch (error) {
    console.error('Error obteniendo órdenes:', error)
    return NextResponse.json(
      { error: 'Error al obtener órdenes' },
      { status: 500 }
    )
  }
}

// Crear orden (ya existía)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { quoteId, maestroId, costoMaestro } = body

    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: { 
        lead: true,
        orden: true
      },
    })

    if (!quote) {
      return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 })
    }

    if (quote.orden) {
      return NextResponse.json({ 
        error: `Esta cotización ya tiene una orden creada: ${quote.orden.codigo}` 
      }, { status: 400 })
    }

    if (quote.estado !== 'APROBADA') {
      return NextResponse.json({ error: 'La cotización debe estar aprobada' }, { status: 400 })
    }

    const count = await prisma.order.count({
      where: { regionId: quote.regionId },
    })
    const codigo = `OR-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(count + 1).padStart(4, '0')}`

    const margen = Number(quote.total) - Number(costoMaestro || 0)

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

    await prisma.quote.update({
      where: { id: quoteId },
      data: { estado: 'CONVERTIDA' },
    })

    await prisma.lead.update({
      where: { id: quote.leadId },
      data: { estado: 'CONVERTIDO' },
    })

    return NextResponse.json({ 
      success: true, 
      order: {
        id: order.id,
        codigo: order.codigo,
        margen: Number(order.margen),
      }
    })
  } catch (error: any) {
    console.error('Error creando orden:', error)
    return NextResponse.json({ 
      error: 'Error al crear orden',
      details: error.message 
    }, { status: 500 })
  }
}