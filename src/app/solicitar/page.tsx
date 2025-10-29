import { Suspense } from 'react'
import SolicitarContent from './content'

export default function SolicitarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-4xl">⏳ Cargando...</div>
      </div>
    }>
      <SolicitarContent />
    </Suspense>
  )
}