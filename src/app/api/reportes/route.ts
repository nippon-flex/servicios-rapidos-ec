import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    await auth.protect();

    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get('periodo') || 'mes'; // hoy, semana, mes, año, todo
    
    // Calcular fechas
    const ahora = new Date();
    let fechaInicio: Date;

    switch (periodo) {
      case 'hoy':
        fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
        break;
      case 'semana':
        fechaInicio = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'mes':
        fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        break;
      case 'año':
        fechaInicio = new Date(ahora.getFullYear(), 0, 1);
        break;
      default:
        fechaInicio = new Date(0); // Todo el tiempo
    }

    // 1. SERVICIOS MÁS SOLICITADOS
    const leads = await prisma.lead.findMany({
      where: {
        createdAt: { gte: fechaInicio },
      },
      include: {
        service: true,
      },
    });

    const serviciosCount: { [key: string]: { nombre: string; icono: string; count: number } } = {};
    leads.forEach((lead) => {
      const servicioId = lead.service.id;
      if (!serviciosCount[servicioId]) {
        serviciosCount[servicioId] = {
          nombre: lead.service.nombre,
          icono: lead.service.icono,
          count: 0,
        };
      }
      serviciosCount[servicioId].count++;
    });

    const serviciosMasSolicitados = Object.values(serviciosCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 2. MAESTROS MÁS PRODUCTIVOS
    const ordenesPorMaestro = await prisma.order.findMany({
      where: {
        createdAt: { gte: fechaInicio },
        NOT: {
          maestroId: null
        }
      },
      include: {
        maestro: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    const maestrosCount: { [key: string]: { nombre: string; ordenes: number; completadas: number } } = {};
    ordenesPorMaestro.forEach((orden) => {
      if (!orden.maestro) return;
      const maestroId = orden.maestro.id;
      if (!maestrosCount[maestroId]) {
        maestrosCount[maestroId] = {
          nombre: orden.maestro.nombre,
          ordenes: 0,
          completadas: 0,
        };
      }
      maestrosCount[maestroId].ordenes++;
      if (orden.estado === 'CERRADA') {
        maestrosCount[maestroId].completadas++;
      }
    });

    const maestrosMasProductivos = Object.values(maestrosCount)
      .sort((a, b) => b.completadas - a.completadas)
      .slice(0, 10);

    // 3. TIEMPO PROMEDIO DE CIERRE
    const ordenesCompletadas = await prisma.order.findMany({
      where: {
        estado: 'CERRADA',
        createdAt: { gte: fechaInicio },
      },
      select: {
        createdAt: true,
        updatedAt: true,
      },
    });

    let tiempoPromedioMs = 0;
    if (ordenesCompletadas.length > 0) {
      const totalMs = ordenesCompletadas.reduce((sum, orden) => {
        return sum + (orden.updatedAt.getTime() - orden.createdAt.getTime());
      }, 0);
      tiempoPromedioMs = totalMs / ordenesCompletadas.length;
    }

    const tiempoPromedioDias = Math.round(tiempoPromedioMs / (1000 * 60 * 60 * 24));
    const tiempoPromedioHoras = Math.round((tiempoPromedioMs / (1000 * 60 * 60)) % 24);

    // 4. ZONAS CON MÁS DEMANDA
const leadsConRegion = await prisma.lead.findMany({
  where: {
    createdAt: { gte: fechaInicio },
  },
  include: {
    region: true,
  },
});

// Filtrar solo los que tienen región
const leadsConRegionValidos = leadsConRegion.filter(lead => lead.regionId !== null && lead.region !== null);

const zonasCount: { [key: string]: { ciudad: string; pais: string; count: number } } = {};
leadsConRegionValidos.forEach((lead) => {
  if (!lead.region) return;
  const regionId = lead.region.id;
  if (!zonasCount[regionId]) {
    zonasCount[regionId] = {
      ciudad: lead.region.ciudad,
      pais: lead.region.pais,
      count: 0,
    };
  }
  zonasCount[regionId].count++;
});

const zonasMasDemanda = Object.values(zonasCount)
  .sort((a, b) => b.count - a.count)
  .slice(0, 10);

    // ESTADÍSTICAS GENERALES
    const totalLeads = leads.length;
    const totalOrdenes = await prisma.order.count({
      where: { createdAt: { gte: fechaInicio } },
    });
    const ordenesCompletadasCount = ordenesCompletadas.length;
    const tasaConversion = totalLeads > 0 ? ((totalOrdenes / totalLeads) * 100).toFixed(1) : '0';

    return NextResponse.json({
      periodo,
      fechaInicio,
      estadisticas: {
        totalLeads,
        totalOrdenes,
        ordenesCompletadas: ordenesCompletadasCount,
        tasaConversion: `${tasaConversion}%`,
      },
      serviciosMasSolicitados,
      maestrosMasProductivos,
      tiempoPromedioCierre: {
        dias: tiempoPromedioDias,
        horas: tiempoPromedioHoras,
        texto: `${tiempoPromedioDias} días, ${tiempoPromedioHoras} horas`,
      },
      zonasMasDemanda,
    });
  } catch (error) {
    console.error('Error generando reportes:', error);
    return NextResponse.json({ error: 'Error al generar reportes' }, { status: 500 });
  }
}