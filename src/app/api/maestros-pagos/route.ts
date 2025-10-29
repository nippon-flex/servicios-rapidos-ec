import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Registrar pago a maestro
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { maestroId, orderId, monto, metodo, referencia, notas } = body

    if (!maestroId || !monto) {
      return NextResponse.json(
        { error: 'Maestro y monto son requeridos' },
        { status: 400 }
      )
    }

    // Validar que el maestro existe
    const maestro = await prisma.user.findUnique({
      where: { id: maestroId },
    })

    if (!maestro) {
      return NextResponse.json(
        { error: 'Maestro no encontrado' },
        { status: 404 }
      )
    }

    // Si hay orden, validar que el maestro esté asignado
    if (orderId) {
      const orden = await prisma.order.findUnique({
        where: { id: orderId },
      })

      if (orden?.maestroId !== maestroId) {
        return NextResponse.json(
          { error: 'El maestro no está asignado a esta orden' },
          { status: 400 }
        )
      }
    }

    // Crear pago
    const pago = await prisma.maestroPago.create({
      data: {
        maestroId,
        orderId: orderId || null,
        monto: Number(monto),
        metodo,
        referencia: referencia || null,
        notas: notas || null,
      },
    })

    return NextResponse.json({
      success: true,
      pago: {
        id: pago.id,
        monto: Number(pago.monto),
      },
    })
  } catch (error: any) {
    console.error('Error registrando pago a maestro:', error)
    return NextResponse.json(
      { error: 'Error al registrar pago', details: error.message },
      { status: 500 }
    )
  }
}

// Obtener todos los pagos a maestros (con filtros opcionales)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const maestroId = searchParams.get('maestroId')

    const where = maestroId ? { maestroId } : {}

    const pagos = await prisma.maestroPago.findMany({
      where,
      include: {
        maestro: true,
        order: {
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
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ pagos })
  } catch (error) {
    console.error('Error obteniendo pagos:', error)
    return NextResponse.json(
      { error: 'Error al obtener pagos' },
      { status: 500 }
    )
  }
}