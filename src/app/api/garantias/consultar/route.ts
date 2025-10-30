import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Consultar garantía por código (público, sin auth)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.codigo) {
      return NextResponse.json({ error: 'Código requerido' }, { status: 400 });
    }

    const garantia = await prisma.warrantyCase.findUnique({
      where: { codigo: body.codigo },
      include: {
        order: {
          include: {
            quote: {
              include: {
                lead: {
                  include: {
                    service: {
                      select: {
                        nombre: true,
                        icono: true,
                      },
                    },
                  },
                },
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
    return NextResponse.json({ error: 'Error al consultar' }, { status: 500 });
  }
}