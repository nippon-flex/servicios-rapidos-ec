import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// Obtener cotización por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await auth.protect()
    const { id } = await params

    const cotizacion = await prisma.quote.findUnique({
      where: { id },
      include: {
        items: true,
        lead: {
          include: {
            service: true,
          },
        },
        orden: true,
      },
    })

    if (!cotizacion) {
      return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 })
    }

    return NextResponse.json(cotizacion)
  } catch (error) {
    console.error('Error obteniendo cotización:', error)
    return NextResponse.json(
      { error: 'Error al obtener cotización' },
      { status: 500 }
    )
  }
}

// Actualizar cotización
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await auth.protect()
    const { id } = await params
    const body = await request.json()

    const cotizacion = await prisma.quote.update({
      where: { id },
      data: {
        estado: body.estado,
      },
      include: {
        items: true,
        lead: {
          include: {
            service: true,
          },
        },
      },
    })

    // Si se aprueba la cotización, actualizar el lead
    if (body.estado === 'APROBADA') {
      await prisma.lead.update({
        where: { id: cotizacion.leadId },
        data: { estado: 'CONTACTADO' },
      })
    }

    return NextResponse.json(cotizacion)
  } catch (error) {
    console.error('Error actualizando cotización:', error)
    return NextResponse.json(
      { error: 'Error al actualizar cotización' },
      { status: 500 }
    )
  }
}

// Eliminar cotización
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await auth.protect()
    const { id } = await params

    await prisma.quote.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error eliminando cotización:', error)
    return NextResponse.json(
      { error: 'Error al eliminar cotización' },
      { status: 500 }
    )
  }
}