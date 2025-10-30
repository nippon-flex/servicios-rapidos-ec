import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener pagos a maestros
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const pagos = await prisma.maestroPago.findMany({
      include: {
        maestro: {
          select: {
            nombre: true,
            telefono: true,
            email: true,
          },
        },
        order: {
          select: {
            codigo: true,
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

// POST - Registrar pago a maestro
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();

    const pago = await prisma.maestroPago.create({
      data: {
        maestroId: body.maestroId,
        orderId: body.orderId || null,
        monto: body.monto,
        metodo: body.metodo,
        referencia: body.referencia || null,
        comprobanteUrl: body.comprobanteUrl || null,
        notas: body.notas || null,
        fecha: body.fecha ? new Date(body.fecha) : new Date(),
      },
      include: {
        maestro: {
          select: {
            nombre: true,
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