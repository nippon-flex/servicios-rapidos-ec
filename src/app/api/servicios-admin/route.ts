import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener TODOS los servicios (requiere autenticación)
export async function GET() {
  try {
    await auth.protect();
    
    const servicios = await prisma.service.findMany({
      orderBy: { nombre: 'asc' },
    });
    
    return NextResponse.json(servicios);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al obtener servicios' }, { status: 500 });
  }
}

// POST - Crear nuevo servicio (requiere autenticación)
export async function POST(request: Request) {
  try {
    await auth.protect();
    
    const body = await request.json();
    
    // Obtener región de Quito
    const region = await prisma.region.findFirst({
      where: { ciudad: 'Quito', pais: 'Ecuador' },
    });
    
    if (!region) {
      return NextResponse.json({ error: 'Región no encontrada' }, { status: 400 });
    }
    
    const servicio = await prisma.service.create({
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion,
        icono: body.icono,
        slug: body.nombre.toLowerCase().replace(/\s+/g, '-'),
        precioBase: body.precioBase,
        unidad: body.unidad,
        activo: body.activo,
        regionId: region.id,
        orden: 999,
      },
    });
    
    return NextResponse.json(servicio, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al crear servicio' }, { status: 500 });
  }
}