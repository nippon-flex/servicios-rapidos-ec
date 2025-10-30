import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener garantía por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await auth.protect();

    const { id } = await params;

    const garantia = await prisma.warrantyCase.findUnique({
      where: { id },
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
              },
            },
          },
        },
      },
    });

    if (!garantia) {
      return NextResponse.json({ error: 'Garantía no encontrada' }, { status: 404 });
    }

    return NextResponse.json(garantia);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al obtener garantía' }, { status: 500 });
  }
}

// PUT - Actualizar garantía
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await auth.protect();

    const { id } = await params;
    const body = await request.json();

    const garantia = await prisma.warrantyCase.update({
      where: { id },
      data: {
        estado: body.estado,
        cubierta: body.cubierta,
        motivoRechazo: body.motivoRechazo,
        ordenReparacion: body.ordenReparacion,
        resolucion: body.resolucion,
        resueltaEn: body.estado === 'RESUELTA' ? new Date() : undefined,
      },
    });

    return NextResponse.json(garantia);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al actualizar garantía' }, { status: 500 });
  }
}

// DELETE - Eliminar garantía
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await auth.protect();

    const { id } = await params;

    await prisma.warrantyCase.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al eliminar garantía' }, { status: 500 });
  }
}