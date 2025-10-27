import { EMPRESA } from './constants'

/**
 * Genera enlace wa.me con mensaje prellenado
 */
export function crearEnlaceWhatsApp(mensaje: string, telefono?: string): string {
  const phone = telefono || EMPRESA.whatsappNumber
  const text = encodeURIComponent(mensaje)
  return `https://wa.me/${phone}?text=${text}`
}

/**
 * Abre WhatsApp en nueva ventana
 */
export function abrirWhatsApp(mensaje: string, telefono?: string): void {
  const url = crearEnlaceWhatsApp(mensaje, telefono)
  window.open(url, '_blank')
}