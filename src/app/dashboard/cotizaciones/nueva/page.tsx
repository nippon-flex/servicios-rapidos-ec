import { Suspense } from 'react'
import NuevaCotizacionContent from './content'

export default function NuevaCotizacionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-4xl">⏳ Cargando...</div>
      </div>
    }>
      <NuevaCotizacionContent />
    </Suspense>
  )
}