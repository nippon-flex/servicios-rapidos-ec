import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { leadId, items, aplicarIva, subtotal, impuesto, total, anticipo, saldo } = body

    // Validar que exista el lead
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { region: true },
    })

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead no encontrado' },
        { status: 404 }
      )
    }

    // Generar código de cotización
    const count = await prisma.quote.count({
      where: { regionId: lead.regionId },
    })
    const codigo = `CT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(count + 1).padStart(4, '0')}`

    // Calcular fecha de expiración (7 días)
    const fechaExpira = new Date()
    fechaExpira.setDate(fechaExpira.getDate() + 7)

    // Crear cotización
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
        fechaExpira,
        estado: 'BORRADOR',
        items: {
          create: items.map((item: any, index: number) => ({
            tipo: item.tipo,
            descripcion: item.descripcion,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            total: item.total,
            orden: index,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    // Actualizar estado del lead
    await prisma.lead.update({
      where: { id: leadId },
      data: { estado: 'COTIZANDO' },
    })

    return NextResponse.json({
      success: true,
      quote,
    })
  } catch (error) {
    console.error('Error creando cotización:', error)
    return NextResponse.json(
      { error: 'Error al crear cotización' },
      { status: 500 }
    )
  }
}