export default function PoliticasGarantiaPage() {
  return (
    <div className="max-w-2xl mx-auto py-14 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">🛡️ Políticas de Garantía</h1>
      <p className="mb-4 text-lg text-gray-700">
        Nuestra garantía cubre todos los servicios realizados por nuestros maestros certificados durante <b>90 días</b>.
      </p>
      <ul className="list-disc ml-6 mb-6 text-gray-700">
        <li>Aplicable solo a trabajos pagados y finalizados.</li>
        <li>Cubre defectos de mano de obra y problemas directamente relacionados al servicio solicitado.</li>
        <li>No cubre daños causados por uso incorrecto, accidentes o terceros.</li>
        <li>No incluye materiales o repuestos proporcionados por el cliente.</li>
        <li>Para activar la garantía, contáctanos por WhatsApp o e-mail dentro de los 90 días posteriores al servicio.</li>
      </ul>
      <p className="text-gray-700">
        Si tienes algún reclamo, tu satisfacción es nuestra prioridad.<br/>
        Responde a esta garantía nuestro equipo de soporte y atención al cliente.
      </p>
      <div className="mt-8">
        <a
          href="https://wa.me/593987531450"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-green-600 text-white rounded font-bold shadow hover:bg-green-700"
        >
          Contactar Soporte por WhatsApp
        </a>
      </div>
    </div>
  )
}
