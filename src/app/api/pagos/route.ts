import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderId, tipo, metodo, monto, referencia, comprobanteUrl } = body

    // Validar orden
    const orden = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        quote: true,
        pagos: true,
      },
    })

    if (!orden) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    // Crear pago
    const pago = await prisma.payment.create({
      data: {
        orderId,
        tipo,
        metodo,
        monto: Number(monto),
        referencia: referencia || null,
        comprobanteUrl: comprobanteUrl || null,
        validado: true, // Por defecto validado (eres tú quien lo registra)
      },
    })

    // Actualizar estado de la orden según el tipo de pago
    let nuevoEstado = orden.estado

    if (tipo === 'ANTICIPO') {
      nuevoEstado = 'ANTICIPO_PAGADO'
    } else if (tipo === 'SALDO') {
      nuevoEstado = 'CERRADA'
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { estado: nuevoEstado },
    })

    return NextResponse.json({
      success: true,
      pago: {
        id: pago.id,
        monto: Number(pago.monto),
        tipo: pago.tipo,
      },
      nuevoEstado,
    })
  } catch (error: any) {
    console.error('Error registrando pago:', error)
    return NextResponse.json(
      { error: 'Error al registrar pago', details: error.message },
      { status: 500 }
    )
  }
}