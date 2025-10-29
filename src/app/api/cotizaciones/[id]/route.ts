import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { orden: 'asc' },
        },
        lead: {
          include: {
            service: true,
          },
        },
      },
    })

    if (!quote) {
      return NextResponse.json(
        { error: 'Cotización no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(quote)
  } catch (error) {
    console.error('Error obteniendo cotización:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const quote = await prisma.quote.update({
      where: { id },
      data: {
        estado: body.estado || 'ENVIADA',
        enviadaEn: body.estado === 'ENVIADA' ? new Date() : undefined,
        aprobadaEn: body.estado === 'APROBADA' ? new Date() : undefined,
      },
    })

    return NextResponse.json(quote)
  } catch (error) {
    console.error('Error actualizando cotización:', error)
    return NextResponse.json(
      { error: 'Error al actualizar' },
      { status: 500 }
    )
  }
}