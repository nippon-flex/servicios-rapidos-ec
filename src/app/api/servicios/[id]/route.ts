import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await auth.protect();
    
    const { id } = await params;
    const body = await request.json();
    
    const servicio = await prisma.service.update({
      where: { id },
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion,
        icono: body.icono,
        slug: body.nombre.toLowerCase().replace(/\s+/g, '-'),
        precioBase: body.precioBase,
        unidad: body.unidad,
        activo: body.activo,
      },
    });
    
    return NextResponse.json(servicio);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await auth.protect();
    
    const { id } = await params;
    
    await prisma.service.delete({ where: { id } });
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}