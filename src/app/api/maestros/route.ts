import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Listar maestros
export async function GET() {
  try {
    const maestros = await prisma.user.findMany({
      where: {
        rol: 'MAESTRO',
      },
      include: {
        ordenesAsignadas: {
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
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        nombre: 'asc',
      },
    })

    return NextResponse.json({ maestros })
  } catch (error) {
    console.error('Error obteniendo maestros:', error)
    return NextResponse.json(
      { error: 'Error al obtener maestros' },
      { status: 500 }
    )
  }
}

// Crear maestro
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, telefono, ci, especialidades, cuentaBanco, regionId } = body

    // Validaciones
    if (!nombre || !telefono) {
      return NextResponse.json(
        { error: 'Nombre y teléfono son requeridos' },
        { status: 400 }
      )
    }

    // Obtener organización (asumimos la primera por ahora)
    const organizacion = await prisma.organization.findFirst()

    if (!organizacion) {
      return NextResponse.json(
        { error: 'No hay organización configurada' },
        { status: 400 }
      )
    }

    // Buscar región de Quito si no se especifica
    let regionIdFinal = regionId
    if (!regionIdFinal) {
      const region = await prisma.region.findFirst({
        where: {
          ciudad: 'Quito',
          pais: 'Ecuador',
        },
      })
      regionIdFinal = region?.id
    }

    const maestro = await prisma.user.create({
      data: {
        nombre,
        telefono,
        ci: ci || null,
        rol: 'MAESTRO',
        organizationId: organizacion.id,
        regionId: regionIdFinal || null,
        especialidades: especialidades || [],
        cuentaBanco: cuentaBanco || null,
        activo: true,
      },
    })

    return NextResponse.json({
      success: true,
      maestro: {
        id: maestro.id,
        nombre: maestro.nombre,
        telefono: maestro.telefono,
      },
    })
  } catch (error: any) {
    console.error('Error creando maestro:', error)
    return NextResponse.json(
      { error: 'Error al crear maestro', details: error.message },
      { status: 500 }
    )
  }
}