import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar datos requeridos
    if (!body.nombre || !body.telefono || !body.servicio || !body.direccion || !body.descripcion) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Obtener región de Quito
    const region = await prisma.region.findFirst({
      where: {
        ciudad: 'Quito',
        pais: 'Ecuador',
      },
    })

    if (!region) {
      return NextResponse.json(
        { error: 'Región no encontrada' },
        { status: 500 }
      )
    }

    // Buscar servicio
    const servicio = await prisma.service.findFirst({
      where: {
        regionId: region.id,
        slug: body.servicio,
      },
    })

    if (!servicio) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 400 }
      )
    }

    // Generar código de lead
    const count = await prisma.lead.count({
      where: { regionId: region.id },
    })
    const codigo = `LD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(count + 1).padStart(4, '0')}`

    // Crear lead
    const lead = await prisma.lead.create({
      data: {
        codigo,
        regionId: region.id,
        serviceId: servicio.id,
        clienteNombre: body.nombre,
        clienteTelefono: body.telefono,
        clienteEmail: body.email || null,
        direccion: body.direccion,
        descripcion: body.descripcion,
        urgente: body.urgente || false,
        fuente: 'web',
        estado: 'NUEVO',
        fotos: [],
      },
    })

    return NextResponse.json({
      success: true,
      lead: {
        id: lead.id,
        codigo: lead.codigo,
      },
    })
  } catch (error) {
    console.error('Error creando lead:', error)
    return NextResponse.json(
      { error: 'Error al procesar solicitud' },
      { status: 500 }
    )
  }
}
