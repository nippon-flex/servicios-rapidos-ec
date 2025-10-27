import { NextResponse } from 'next/server';
import { generarMensajeWhatsApp } from '@/lib/openai';

export async function POST() {
  try {
    const mensaje = await generarMensajeWhatsApp('cotizacion', {
      clienteNombre: 'María González',
      servicio: 'Reparación de plomería',
      total: 53.20,
      anticipo: 15.96,
      codigo: 'CT-2025-01-001',
    });

    return NextResponse.json({ mensaje });
  } catch (error) {
    console.error('Error en test-ai:', error);
    return NextResponse.json(
      { error: 'Error al generar mensaje' },
      { status: 500 }
    );
  }
}