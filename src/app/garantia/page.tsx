'use client';

import { useState } from 'react';
import { formatearFecha } from '@/lib/utils';

interface ResultadoBusqueda {
  codigo: string;
  fechaReporte: string;
  estado: string;
  cubierta: boolean | null;
  motivoRechazo: string | null;
  resolucion: string | null;
  resueltaEn: string | null;
  clienteReporte: string;
  order: {
    codigo: string;
    fechaFin: string | null;
    quote: {
      service: {
        nombre: string;
        icono: string;
      };
    };
  };
}

const ESTADOS_CLIENTE = {
  REPORTADA: { label: 'Reportada', desc: 'Hemos recibido tu reporte y lo estamos revisando', color: 'blue', icon: '🆕' },
  EN_REVISION: { label: 'En Revisión', desc: 'Estamos evaluando tu caso', color: 'yellow', icon: '🔍' },
  APROBADA: { label: 'Aprobada', desc: 'Tu garantía ha sido aprobada', color: 'green', icon: '✅' },
  RECHAZADA: { label: 'Rechazada', desc: 'Tu caso no está cubierto por la garantía', color: 'red', icon: '❌' },
  EN_REPARACION: { label: 'En Reparación', desc: 'Estamos trabajando en solucionar el problema', color: 'purple', icon: '🔧' },
  RESUELTA: { label: 'Resuelta', desc: 'Tu caso ha sido resuelto exitosamente', color: 'gray', icon: '✔️' },
};

export default function ConsultarGarantiaPage() {
  const [codigo, setCodigo] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoBusqueda | null>(null);
  const [error, setError] = useState('');

  const buscarGarantia = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigo.trim()) {
      setError('Por favor ingresa un código de garantía');
      return;
    }

    try {
      setBuscando(true);
      setError('');
      setResultado(null);

      // Nota: Esta API la crearemos después (búsqueda pública)
      const res = await fetch('/api/garantias/consultar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: codigo.toUpperCase() }),
      });

      if (res.ok) {
        const data = await res.json();
        setResultado(data);
      } else if (res.status === 404) {
        setError('No se encontró ninguna garantía con ese código');
      } else {
        setError('Error al buscar. Intenta de nuevo.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setBuscando(false);
    }
  };

  const diasGarantia = 90;
  const diasTranscurridos = resultado?.order.fechaFin 
    ? Math.floor((new Date().getTime() - new Date(resultado.order.fechaFin).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const diasRestantes = diasGarantia - diasTranscurridos;
  const vigente = diasRestantes > 0;

  const estadoInfo = resultado ? ESTADOS_CLIENTE[resultado.estado as keyof typeof ESTADOS_CLIENTE] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🛡️ Consulta tu Garantía
          </h1>
          <p className="text-gray-600">
            Ingresa el código de tu garantía para ver su estado
          </p>
        </div>

        {/* Formulario de búsqueda */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={buscarGarantia}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Código de Garantía
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                placeholder="Ej: GAR-2025-00001"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono"
              />
              <button
                type="submit"
                disabled={buscando}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {buscando ? '🔍 Buscando...' : '🔍 Buscar'}
              </button>
            </div>
            
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Resultados */}
        {resultado && (
          <div className="space-y-6">
            {/* Estado */}
            <div className={`bg-white rounded-2xl shadow-xl p-8 border-l-4 ${
              estadoInfo?.color === 'blue' ? 'border-blue-500' :
              estadoInfo?.color === 'yellow' ? 'border-yellow-500' :
              estadoInfo?.color === 'green' ? 'border-green-500' :
              estadoInfo?.color === 'red' ? 'border-red-500' :
              estadoInfo?.color === 'purple' ? 'border-purple-500' :
              'border-gray-500'
            }`}>
              <div className="flex items-start gap-4">
                <div className="text-5xl">{estadoInfo?.icon}</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {estadoInfo?.label}
                  </h2>
                  <p className="text-gray-600 mb-4">{estadoInfo?.desc}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Código</div>
                      <div className="font-semibold text-gray-900">{resultado.codigo}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Fecha de reporte</div>
                      <div className="font-semibold text-gray-900">
                        {formatearFecha(new Date(resultado.fechaReporte))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vigencia */}
            <div className={`rounded-2xl shadow-xl p-6 ${
              vigente ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{vigente ? '✅' : '⚠️'}</span>
                <div>
                  <div className="font-bold text-gray-900">
                    {vigente ? 'Garantía vigente' : 'Garantía vencida'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {vigente 
                      ? `Te quedan ${diasRestantes} días de ${diasGarantia} días totales`
                      : `Venció hace ${Math.abs(diasRestantes)} días`
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Información del servicio */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Servicio realizado</h3>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{resultado.order.quote.service.icono}</span>
                <div>
                  <div className="font-semibold text-gray-900">{resultado.order.quote.service.nombre}</div>
                  <div className="text-sm text-gray-600">Orden: {resultado.order.codigo}</div>
                </div>
              </div>
              {resultado.order.fechaFin && (
                <div className="text-sm text-gray-600">
                  Finalizado el: {formatearFecha(new Date(resultado.order.fechaFin))}
                </div>
              )}
            </div>

            {/* Tu reporte */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Tu reporte</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-900 whitespace-pre-wrap">
                {resultado.clienteReporte}
              </div>
            </div>

            {/* Cubierta o rechazada */}
            {resultado.cubierta !== null && (
              <div className={`rounded-2xl shadow-xl p-6 ${
                resultado.cubierta ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{resultado.cubierta ? '✅' : '❌'}</span>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">
                      {resultado.cubierta ? 'Cubierta por la garantía' : 'No cubierta por la garantía'}
                    </div>
                    {resultado.motivoRechazo && (
                      <div className="text-sm text-gray-700">
                        <strong>Motivo:</strong> {resultado.motivoRechazo}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Resolución */}
            {resultado.resolucion && (
              <div className="bg-green-50 border border-green-200 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-green-900 mb-3">✅ Resolución</h3>
                <div className="bg-white p-4 rounded-lg text-gray-900 whitespace-pre-wrap">
                  {resultado.resolucion}
                </div>
                {resultado.resueltaEn && (
                  <div className="text-sm text-green-700 mt-3">
                    Resuelta el: {formatearFecha(new Date(resultado.resueltaEn))}
                  </div>
                )}
              </div>
            )}

            {/* Contacto */}
            <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
              <p className="text-gray-600 mb-4">¿Tienes dudas sobre tu garantía?</p>
              <a
                href="https://wa.me/593987531450?text=Hola, tengo una consulta sobre mi garantía"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                💬 Contáctanos por WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Información adicional */}
        {!resultado && !error && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="font-bold text-blue-900 mb-2">ℹ️ ¿Dónde encuentro mi código?</h3>
            <p className="text-blue-800 text-sm">
              El código de garantía te fue enviado por WhatsApp cuando se completó tu servicio.
              Tiene el formato: <strong>GAR-2025-00001</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}