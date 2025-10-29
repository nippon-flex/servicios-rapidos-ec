import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const orden = await prisma.order.findUnique({
      where: { id },
      include: {
        quote: {
          include: {
            lead: {
              include: {
                service: true,
              },
            },
            items: true,
          },
        },
        maestro: true,
        pagos: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!orden) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(orden)
  } catch (error) {
    console.error('Error obteniendo orden:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}