import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Registrar un caso de garantía (POST)
export async function POST(request: Request) {
  const body = await request.json()
  const {
    orderId,
    clienteReporte,
    fotos,
  } = body

  // Campo obligatorio: orderId y motivo del cliente
  if (!orderId || !clienteReporte) {
    return NextResponse.json({ error: 'Faltan datos obligatorios.' }, { status: 400 })
  }

  // Crea el caso de garantía
  const nuevoCaso = await prisma.warrantyCase.create({
    data: {
      orderId,
      clienteReporte,
      fotos: fotos || [],
      // Los otros campos quedan en null/inicial
    }
  })

  return NextResponse.json(nuevoCaso, { status: 201 })
}

// Listar todos los casos de garantía (GET)
export async function GET() {
  const casos = await prisma.warrantyCase.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(casos)
}
