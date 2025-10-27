export const EMPRESA = {
  nombre: process.env.NEXT_PUBLIC_EMPRESA_NOMBRE || 'Servicios Rápidos EC',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '+593987531450',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '593987531450',
}

export const DATOS_BANCARIOS = {
  banco: process.env.NEXT_PUBLIC_BANCO || 'Banco Pichincha',
  titular: process.env.NEXT_PUBLIC_TITULAR || 'Rafael Millan',
  ci: process.env.NEXT_PUBLIC_CI || '1761993722',
  cuenta: process.env.NEXT_PUBLIC_CUENTA || '2210554536',
  tipoCuenta: process.env.NEXT_PUBLIC_TIPO_CUENTA || 'Cuenta de Ahorros',
}

export const GARANTIA = {
  dias: 90,
  anticipoPorcentaje: 30,
  saldoPorcentaje: 70,
}

export const POLITICAS = {
  cancelacion: `
## ❌ POLÍTICA DE CANCELACIÓN

### Antes de pagar el anticipo
Puedes cancelar sin costo alguno.

### Después de pagar el anticipo (30%)
- Antes de agendar: Reembolso del 70%
- Después de agendar (>24h): Reembolso del 50%
- Con menos de 24h: Sin reembolso

### Proceso de reembolso
Transferencia en 3-5 días hábiles.
  `.trim(),

  garantia: `
## 🛡️ GARANTÍA DE 90 DÍAS

### Cobertura
✅ Defectos de mano de obra
✅ Materiales instalados por nosotros
✅ Funcionalidad del servicio

### Exclusiones
❌ Daños por mal uso
❌ Desgaste normal
❌ Condiciones preexistentes
❌ Modificaciones posteriores
  `.trim(),
}