import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar datos requeridos
    if (!body.serviceId || !body.clienteNombre || !body.clienteTelefono || !body.direccion || !body.descripcion) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Obtener organización
    const organizacion = await prisma.organization.findFirst();
    
    if (!organizacion) {
      return NextResponse.json(
        { error: 'Organización no encontrada' },
        { status: 500 }
      );
    }

    // Obtener región de Quito
    const region = await prisma.region.findFirst({
      where: {
        ciudad: 'Quito',
        pais: 'Ecuador',
      },
    });

    if (!region) {
      return NextResponse.json(
        { error: 'Región no encontrada' },
        { status: 500 }
      );
    }

    // Verificar que el servicio existe
    const servicio = await prisma.service.findUnique({
      where: {
        id: body.serviceId,
      },
    });

    if (!servicio) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 400 }
      );
    }

    // Generar código de lead
    const count = await prisma.lead.count({
      where: { regionId: region.id },
    });
    const codigo = `LD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(count + 1).padStart(4, '0')}`;

    // Crear lead
    const lead = await prisma.lead.create({
      data: {
        codigo,
        organizationId: organizacion.id,
        regionId: region.id,
        serviceId: body.serviceId,
        clienteNombre: body.clienteNombre,
        clienteTelefono: body.clienteTelefono,
        clienteEmail: body.clienteEmail || null,
        direccion: body.direccion,
        descripcion: body.descripcion,
        urgencia: body.urgente ? 'urgente' : 'normal',
        estado: 'NUEVO',
        fotos: [],
      },
    });

    return NextResponse.json({
      success: true,
      lead: {
        id: lead.id,
        codigo: lead.codigo,
      },
    });
  } catch (error) {
    console.error('Error creando lead:', error);
    return NextResponse.json(
      { error: 'Error al procesar solicitud' },
      { status: 500 }
    );
  }
}