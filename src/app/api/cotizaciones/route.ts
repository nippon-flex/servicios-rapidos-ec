import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cotizaciones = await prisma.quote.findMany({
      include: {
        lead: {
          include: {
            service: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(cotizaciones)
  } catch (error) {
    console.error('Error al obtener cotizaciones:', error)
    return NextResponse.json({ error: 'Error al obtener cotizaciones' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { leadId, items, aplicarIVA } = body

    console.log('📦 Datos recibidos:', { leadId, itemsCount: items?.length, aplicarIVA })

    // Validar lead
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { region: true },
    })

    if (!lead) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 })
    }

    console.log('✅ Lead encontrado:', lead.codigo)

    // Calcular totales
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + (Number(item.cantidad) * Number(item.precioUnitario))
    }, 0)

    // Aplicar impuesto solo si hay región configurada
    let impuesto = 0
    if (aplicarIVA && lead.region) {
      const tasaImpuesto = 0.15 // 15% IVA por defecto
      impuesto = subtotal * tasaImpuesto
    }

    const total = subtotal + impuesto

    // Calcular anticipo (30% por defecto)
    const anticipoPorcentaje = 0.30
    const anticipo = total * anticipoPorcentaje
    const saldo = total - anticipo

    console.log('💰 Totales:', { subtotal, impuesto, total, anticipo, saldo })

    // Generar código
    const count = await prisma.quote.count({
      where: { regionId: lead.regionId },
    })

    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')
    const secuencia = String(count + 1).padStart(4, '0')
    const codigo = `CT-${year}${month}-${secuencia}`

    console.log('🔢 Código:', codigo)
    console.log('🚀 Creando cotización...')

    // Crear cotización con items
    const quote = await prisma.quote.create({
      data: {
        codigo,
        leadId,
        regionId: lead.regionId,
        subtotal,
        impuesto,
        total,
        anticipo,
        saldo,
        estado: 'BORRADOR',
        items: {
          create: items.map((item: any) => ({
            descripcion: item.descripcion,
            cantidad: Number(item.cantidad),
            precioUnitario: Number(item.precioUnitario),
            total: Number(item.cantidad) * Number(item.precioUnitario),
          })),
        },
      },
      include: {
        items: true,
      },
    })

    console.log('✅ Cotización creada:', quote.id)

    // Actualizar lead
    await prisma.lead.update({
      where: { id: leadId },
      data: { estado: 'COTIZADO' },
    })

    console.log('✅ Lead actualizado a COTIZADO')

    return NextResponse.json({
      success: true,
      quote: {
        id: quote.id,
        codigo: quote.codigo,
        total: Number(quote.total),
      },
    })
  } catch (error: any) {
    console.error('❌ ERROR COMPLETO:', error)
    console.error('❌ Mensaje:', error.message)
    console.error('❌ Meta:', error.meta)
    
    return NextResponse.json(
      { 
        error: 'Error al crear cotización',
        message: error.message,
        details: error.meta || error.toString()
      },
      { status: 500 }
    )
  }
}