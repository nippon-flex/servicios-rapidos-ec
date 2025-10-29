import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    const tasaImpuesto = Number(lead.region.impuesto) / 100
    const impuesto = aplicarIVA ? subtotal * tasaImpuesto : 0
    const total = subtotal + impuesto
    const anticipoPorcentaje = Number(lead.region.anticipoPct) / 100
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

    // Fecha expiración
    const validezDias = 7
    const fechaExpira = new Date()
    fechaExpira.setDate(fechaExpira.getDate() + validezDias)

    console.log('📅 Expira:', fechaExpira.toISOString())

    // Crear cotización con items
    console.log('🚀 Creando cotización...')

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
        validezDias,
        fechaExpira,
        estado: 'BORRADOR',
        items: {
          create: items.map((item: any, index: number) => ({
            tipo: 'MANO_OBRA',
            descripcion: item.descripcion,
            cantidad: Number(item.cantidad),
            precioUnitario: Number(item.precioUnitario),
            total: Number(item.cantidad) * Number(item.precioUnitario),
            orden: index,
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
      data: { estado: 'COTIZANDO' },
    })

    console.log('✅ Lead actualizado a COTIZANDO')

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