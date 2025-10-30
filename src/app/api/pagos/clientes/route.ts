import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener pagos de clientes
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const pagos = await prisma.payment.findMany({
      include: {
        order: {
          include: {
            quote: {
              include: {
                lead: {
                  select: {
                    clienteNombre: true,
                    clienteTelefono: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    });

    return NextResponse.json(pagos);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al obtener pagos' }, { status: 500 });
  }
}

// POST - Registrar nuevo pago de cliente
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();

    // Validar que la orden existe
    const orden = await prisma.order.findUnique({
      where: { id: body.orderId },
    });

    if (!orden) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 400 });
    }

    const pago = await prisma.payment.create({
      data: {
        orderId: body.orderId,
        tipo: body.tipo,
        metodo: body.metodo,
        monto: body.monto,
        comprobanteUrl: body.comprobanteUrl || null,
        referencia: body.referencia || null,
        validado: body.metodo === 'EFECTIVO' ? true : false, // Efectivo se valida automáticamente
        validadoPor: body.metodo === 'EFECTIVO' ? userId : null,
        fecha: body.fecha ? new Date(body.fecha) : new Date(),
      },
      include: {
        order: {
          include: {
            quote: {
              include: {
                lead: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(pago, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al crear pago' }, { status: 500 });
  }
}