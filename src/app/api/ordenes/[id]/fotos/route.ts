import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { campo, fotos } = body

    if (!['fotosAntes', 'fotosDurante', 'fotosDespues'].includes(campo)) {
      return NextResponse.json(
        { error: 'Campo inválido' },
        { status: 400 }
      )
    }

    const orden = await prisma.order.update({
      where: { id },
      data: {
        [campo]: fotos,
      },
    })

    return NextResponse.json({ success: true, orden })
  } catch (error: any) {
    console.error('Error actualizando fotos:', error)
    return NextResponse.json(
      { error: 'Error al actualizar fotos', details: error.message },
      { status: 500 }
    )
  }
}