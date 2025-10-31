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

// NUEVO: Actualizar orden (asignar maestro, cambiar estado, etc.)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const orden = await prisma.order.update({
      where: { id },
      data: {
        maestroId: body.maestroId || null,
        estado: body.estado || undefined,
        notasInternas: body.notasInternas || undefined,
      },
      include: {
        maestro: true,
      },
    })

    return NextResponse.json({ success: true, orden })
  } catch (error: any) {
    console.error('Error actualizando orden:', error)
    return NextResponse.json(
      { error: 'Error al actualizar orden', details: error.message },
      { status: 500 }
    )
  }
}