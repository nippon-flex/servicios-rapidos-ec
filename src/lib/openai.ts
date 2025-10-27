import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Genera un mensaje profesional para WhatsApp
 */
export async function generarMensajeWhatsApp(
  tipo: 'cotizacion' | 'anticipo' | 'finalizado' | 'garantia',
  datos: Record<string, any>
): Promise<string> {
  const prompts: Record<string, string> = {
    cotizacion: `
Genera un mensaje profesional de WhatsApp para enviar una cotización al cliente.

Cliente: ${datos.clienteNombre}
Servicio: ${datos.servicio}
Total: $${datos.total}
Anticipo (30%): $${datos.anticipo}
Código: ${datos.codigo}

Requisitos:
- Tono profesional pero cercano (usar "usted")
- Incluir emojis apropiados (sin exceso)
- Agradecimiento por contactarnos
- Resumen claro del servicio y montos
- Indicar validez de 7 días
- Solicitar confirmación
- Máximo 200 palabras
`,

    anticipo: `
Genera un mensaje para solicitar el anticipo del 30% al cliente.

Cliente: ${datos.clienteNombre}
Anticipo: $${datos.anticipo}

Datos bancarios:
- Banco: Banco Pichincha
- Titular: Rafael Millan
- CI: 1761993722
- Cuenta Ahorros: 2210554536

Requisitos:
- Confirmar aprobación de cotización
- Datos bancarios claros y organizados
- Mencionar que también aceptamos efectivo
- Solicitar envío de comprobante
- Tono amable y profesional
`,

    finalizado: `
Genera un mensaje de trabajo finalizado.

Cliente: ${datos.clienteNombre}
Servicio: ${datos.servicio}
Saldo pendiente: $${datos.saldo}

Requisitos:
- Notificar finalización del trabajo
- Agradecer la confianza
- Indicar saldo pendiente y métodos de pago
- Mencionar garantía de 90 días
- Invitar a contactarnos ante dudas
- Tono satisfecho y profesional
`,

    garantia: `
Genera un mensaje confirmando cobertura de garantía.

Cliente: ${datos.clienteNombre}
Problema: ${datos.problema}

Requisitos:
- Confirmar que revisamos el caso
- Informar que está cubierto por garantía
- Sin costo adicional
- Proponer agendar visita
- Disculpas por la molestia
- Tono empático y resolutivo
`,
  };

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Eres un asistente profesional para una empresa de servicios domésticos en Ecuador.
Generas mensajes claros, amables y profesionales para WhatsApp.
Formato: texto plano listo para copiar y enviar.`
        },
        {
          role: 'user',
          content: prompts[tipo]
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0].message.content?.trim() || '';
  } catch (error) {
    console.error('Error generando mensaje:', error);
    throw new Error('No se pudo generar el mensaje');
  }
}