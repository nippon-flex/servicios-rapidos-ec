import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener servicios ACTIVOS (público, sin auth)
export async function GET() {
  try {
    const servicios = await prisma.service.findMany({
      where: {
        activo: true,
      },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        icono: true,
        precioBase: true,
        unidad: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });

    return NextResponse.json(servicios);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    return NextResponse.json(
      { error: 'Error al cargar servicios' },
      { status: 500 }
    );
  }
}