import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatearMoneda(valor: number | string): string {
  const numero = typeof valor === 'string' ? parseFloat(valor) : valor
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
  }).format(numero)
}

export function formatearFecha(fecha: Date | string): string {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha
  return new Intl.DateTimeFormat('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}