import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de base de datos...')

  // 1. CREAR ORGANIZACIÓN
  const org = await prisma.organization.upsert({
    where: { slug: 'servicios-rapidos-ec' },
    update: {},
    create: {
      nombre: 'Servicios Rápidos EC',
      slug: 'servicios-rapidos-ec',
      ownerId: 'manual', // Temporal, se actualizará con el ID real de Clerk
    },
  })
  console.log('✅ Organización creada:', org.nombre)

  // 2. CREAR REGIÓN QUITO
  const regionQuito = await prisma.region.upsert({
    where: {
      organizationId_pais_ciudad: {
        organizationId: org.id,
        pais: 'Ecuador',
        ciudad: 'Quito',
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      pais: 'Ecuador',
      ciudad: 'Quito',
      moneda: 'USD',
      timezone: 'America/Guayaquil',
      impuesto: 15, // IVA 15%
      anticipoPct: 30,
      garantiaDias: 90,
      politicas: {
        cancelacion: 'Antes del anticipo: sin costo. Después: según tiempo.',
        garantia: '90 días sobre mano de obra y materiales instalados.',
      },
    },
  })
  console.log('✅ Región creada:', regionQuito.ciudad)

  // 3. CREAR SERVICIOS INICIALES
  const servicios = [
    {
      slug: 'plomeria',
      nombre: 'Plomería',
      descripcion: 'Reparación e instalación de tuberías, llaves, inodoros, lavabos, calentadores.',
      icono: '🔧',
      precioBase: 35.00,
      unidad: 'servicio',
      checklist: [
        'Foto del área antes de iniciar',
        'Foto del problema específico',
        'Foto de empalmes/conexiones nuevas',
        'Foto del área finalizada',
        'Prueba de fugas (video opcional)'
      ],
    },
    {
      slug: 'electricidad',
      nombre: 'Electricidad',
      descripcion: 'Instalación y reparación eléctrica, tomacorrientes, lámparas, breakers, cableado.',
      icono: '⚡',
      precioBase: 40.00,
      unidad: 'servicio',
      checklist: [
        'Foto del tablero/área antes',
        'Foto del problema',
        'Foto de conexiones realizadas',
        'Foto del área finalizada',
        'Prueba de corriente'
      ],
    },
    {
      slug: 'albanileria',
      nombre: 'Albañilería',
      descripcion: 'Reparación de paredes, pisos, azulejos, enlucidos, mampostería.',
      icono: '🧱',
      precioBase: 45.00,
      unidad: 'm2',
      checklist: [
        'Foto del área a reparar',
        'Medidas del área',
        'Foto durante aplicación',
        'Foto final del acabado'
      ],
    },
    {
      slug: 'pintura',
      nombre: 'Pintura',
      descripcion: 'Pintura interior y exterior, paredes, techos, puertas, ventanas.',
      icono: '🎨',
      precioBase: 8.00,
      unidad: 'm2',
      checklist: [
        'Foto del área antes',
        'Foto de preparación',
        'Foto de primera mano',
        'Foto final'
      ],
    },
    {
      slug: 'carpinteria',
      nombre: 'Carpintería',
      descripcion: 'Reparación e instalación de puertas, ventanas, closets, muebles.',
      icono: '🪚',
      precioBase: 50.00,
      unidad: 'servicio',
      checklist: [
        'Foto del elemento antes',
        'Foto de medidas',
        'Foto durante instalación',
        'Foto final funcionando'
      ],
    },
    {
      slug: 'cerrajeria',
      nombre: 'Cerrajería',
      descripcion: 'Cambio de cerraduras, duplicado de llaves, reparación de chapas.',
      icono: '🔐',
      precioBase: 30.00,
      unidad: 'servicio',
      checklist: [
        'Foto de cerradura antes',
        'Foto de nueva cerradura',
        'Prueba de funcionamiento'
      ],
    },
    {
      slug: 'limpieza',
      nombre: 'Limpieza Profunda',
      descripcion: 'Limpieza de casas, oficinas, post-construcción.',
      icono: '🧹',
      precioBase: 60.00,
      unidad: 'servicio',
      checklist: [
        'Foto de áreas antes',
        'Foto durante limpieza',
        'Foto final'
      ],
    },
    {
      slug: 'fumigacion',
      nombre: 'Fumigación',
      descripcion: 'Control de plagas: cucarachas, ratas, hormigas, termitas.',
      icono: '🐛',
      precioBase: 55.00,
      unidad: 'servicio',
      checklist: [
        'Foto de áreas a fumigar',
        'Foto de productos utilizados',
        'Certificado de fumigación'
      ],
    },
    {
      slug: 'aire-acondicionado',
      nombre: 'Aire Acondicionado',
      descripcion: 'Instalación, mantenimiento y reparación de equipos de A/C.',
      icono: '❄️',
      precioBase: 45.00,
      unidad: 'servicio',
      checklist: [
        'Foto del equipo antes',
        'Foto de filtros/componentes',
        'Prueba de enfriamiento',
        'Foto final'
      ],
    },
    {
      slug: 'jardineria',
      nombre: 'Jardinería',
      descripcion: 'Poda, siembra, mantenimiento de jardines y áreas verdes.',
      icono: '🌱',
      precioBase: 40.00,
      unidad: 'servicio',
      checklist: [
        'Foto del jardín antes',
        'Foto durante trabajo',
        'Foto final del jardín'
      ],
    },
  ]

  let orden = 1
  for (const servicio of servicios) {
    await prisma.service.upsert({
      where: {
        regionId_slug: {
          regionId: regionQuito.id,
          slug: servicio.slug,
        },
      },
      update: {},
      create: {
        ...servicio,
        regionId: regionQuito.id,
        orden: orden++,
      },
    })
    console.log(`✅ Servicio creado: ${servicio.nombre}`)
  }

  console.log('🎉 Seed completado exitosamente!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })