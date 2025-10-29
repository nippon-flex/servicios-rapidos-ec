import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const maestro = await prisma.user.findUnique({
      where: { id },
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
            pagos: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!maestro) {
      return NextResponse.json({ error: 'Maestro no encontrado' }, { status: 404 })
    }

    return NextResponse.json(maestro)
  } catch (error) {
    console.error('Error obteniendo maestro:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const maestro = await prisma.user.update({
      where: { id },
      data: {
        nombre: body.nombre,
        telefono: body.telefono,
        ci: body.ci || null,
        especialidades: body.especialidades || [],
        cuentaBanco: body.cuentaBanco || null,
        activo: body.activo !== undefined ? body.activo : true,
      },
    })

    return NextResponse.json({ success: true, maestro })
  } catch (error: any) {
    console.error('Error actualizando maestro:', error)
    return NextResponse.json(
      { error: 'Error al actualizar maestro', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Verificar si tiene órdenes asignadas
    const maestro = await prisma.user.findUnique({
      where: { id },
      include: {
        ordenesAsignadas: true,
      },
    })

    if (!maestro) {
      return NextResponse.json({ error: 'Maestro no encontrado' }, { status: 404 })
    }

    if (maestro.ordenesAsignadas.length > 0) {
      // No eliminar, solo desactivar
      await prisma.user.update({
        where: { id },
        data: { activo: false },
      })
      return NextResponse.json({
        success: true,
        message: 'Maestro desactivado (tiene órdenes asignadas)',
      })
    }

    // Si no tiene órdenes, eliminar
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: 'Maestro eliminado' })
  } catch (error: any) {
    console.error('Error eliminando maestro:', error)
    return NextResponse.json(
      { error: 'Error al eliminar maestro', details: error.message },
      { status: 500 }
    )
  }
}