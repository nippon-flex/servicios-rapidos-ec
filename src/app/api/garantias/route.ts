import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todas las garantías (requiere autenticación)
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado');

    const garantias = await prisma.warrantyCase.findMany({
      where: estado ? { estado: estado as any } : {},
      include: {
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
            maestro: {
              select: {
                nombre: true,
                telefono: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        fechaReporte: 'desc',
      },
    });

    return NextResponse.json(garantias);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al obtener garantías' }, { status: 500 });
  }
}

// POST - Crear nueva garantía (requiere autenticación)
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();

    // Verificar que la orden existe
    const orden = await prisma.order.findUnique({
      where: { id: body.orderId },
    });

    if (!orden) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 400 });
    }

    // Generar código único
    const count = await prisma.warrantyCase.count();
    const codigo = `GAR-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    // Crear garantía
    const garantia = await prisma.warrantyCase.create({
      data: {
        codigo,
        orderId: body.orderId,
        clienteReporte: body.clienteReporte,
        fotos: body.fotos || [],
        estado: 'REPORTADA',
      },
      include: {
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
    });

    return NextResponse.json(garantia, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al crear garantía' }, { status: 500 });
  }
}