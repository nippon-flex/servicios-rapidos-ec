import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎉 ¡Dashboard de Servicios Rápidos EC!
        </h1>
        <p className="text-lg text-gray-600">
          ✅ Estás autenticado correctamente
        </p>
        <p className="text-sm text-gray-500 mt-2">
          User ID: {userId}
        </p>
      </div>
    </div>
  )
}