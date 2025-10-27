-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('OWNER', 'ADMIN', 'MAESTRO');

-- CreateEnum
CREATE TYPE "EstadoLead" AS ENUM ('NUEVO', 'CONTACTADO', 'COTIZANDO', 'CONVERTIDO', 'DESCARTADO');

-- CreateEnum
CREATE TYPE "EstadoQuote" AS ENUM ('BORRADOR', 'ENVIADA', 'VISTA', 'APROBADA', 'RECHAZADA', 'EXPIRADA', 'CONVERTIDA');

-- CreateEnum
CREATE TYPE "TipoQuoteItem" AS ENUM ('MANO_OBRA', 'MATERIAL', 'VISITA', 'URGENCIA', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoOrder" AS ENUM ('ANTICIPO_PENDIENTE', 'ANTICIPO_PAGADO', 'AGENDADA', 'EN_CAMINO', 'EN_EJECUCION', 'FINALIZADA', 'SALDO_PENDIENTE', 'CERRADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('ANTICIPO', 'SALDO', 'ADICIONAL');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('TRANSFERENCIA', 'EFECTIVO', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoGarantia" AS ENUM ('REPORTADA', 'EN_REVISION', 'APROBADA', 'RECHAZADA', 'EN_REPARACION', 'RESUELTA');

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regiones" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'USD',
    "timezone" TEXT NOT NULL DEFAULT 'America/Guayaquil',
    "impuesto" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "anticipoPct" INTEGER NOT NULL DEFAULT 30,
    "garantiaDias" INTEGER NOT NULL DEFAULT 90,
    "politicas" JSONB,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT,
    "organizationId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT,
    "telefono" TEXT NOT NULL,
    "ci" TEXT,
    "rol" "RolUsuario" NOT NULL,
    "regionId" TEXT,
    "especialidades" TEXT[],
    "calificacion" DECIMAL(3,2),
    "cuentaBanco" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "icono" TEXT,
    "precioBase" DECIMAL(10,2) NOT NULL,
    "unidad" TEXT NOT NULL,
    "checklist" JSONB,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "clienteNombre" TEXT NOT NULL,
    "clienteTelefono" TEXT NOT NULL,
    "clienteEmail" TEXT,
    "direccion" TEXT NOT NULL,
    "referencia" TEXT,
    "descripcion" TEXT NOT NULL,
    "fotos" TEXT[],
    "urgente" BOOLEAN NOT NULL DEFAULT false,
    "fuente" TEXT,
    "utmSource" TEXT,
    "utmCampaign" TEXT,
    "estado" "EstadoLead" NOT NULL DEFAULT 'NUEVO',
    "aiAnalisis" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "impuesto" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "anticipo" DECIMAL(10,2) NOT NULL,
    "saldo" DECIMAL(10,2) NOT NULL,
    "validezDias" INTEGER NOT NULL DEFAULT 7,
    "fechaExpira" TIMESTAMP(3) NOT NULL,
    "pdfUrl" TEXT,
    "estado" "EstadoQuote" NOT NULL DEFAULT 'BORRADOR',
    "enviadaEn" TIMESTAMP(3),
    "aprobadaEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_items" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "tipo" "TipoQuoteItem" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "quote_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "maestroId" TEXT,
    "costoMaestro" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "margen" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "fechaAgendada" TIMESTAMP(3),
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),
    "fotosAntes" TEXT[],
    "fotosDurante" TEXT[],
    "fotosDespues" TEXT[],
    "checklistData" JSONB,
    "estado" "EstadoOrder" NOT NULL DEFAULT 'ANTICIPO_PENDIENTE',
    "notasAdmin" TEXT,
    "notasMaestro" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "tipo" "TipoPago" NOT NULL,
    "metodo" "MetodoPago" NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "comprobanteUrl" TEXT,
    "referencia" TEXT,
    "validado" BOOLEAN NOT NULL DEFAULT false,
    "validadoPor" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warranty_cases" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "clienteReporte" TEXT NOT NULL,
    "fotos" TEXT[],
    "fechaReporte" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cubierta" BOOLEAN,
    "motivoRechazo" TEXT,
    "ordenReparacion" TEXT,
    "resolucion" TEXT,
    "estado" "EstadoGarantia" NOT NULL DEFAULT 'REPORTADA',
    "resueltaEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warranty_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidadId" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "userId" TEXT,
    "userName" TEXT,
    "antes" JSONB,
    "despues" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "regiones_organizationId_pais_ciudad_key" ON "regiones"("organizationId", "pais", "ciudad");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkId_key" ON "users"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "services_regionId_slug_key" ON "services"("regionId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "leads_codigo_key" ON "leads"("codigo");

-- CreateIndex
CREATE INDEX "leads_estado_createdAt_idx" ON "leads"("estado", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_codigo_key" ON "quotes"("codigo");

-- CreateIndex
CREATE INDEX "quotes_estado_createdAt_idx" ON "quotes"("estado", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "orders_codigo_key" ON "orders"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "orders_quoteId_key" ON "orders"("quoteId");

-- CreateIndex
CREATE INDEX "orders_estado_maestroId_idx" ON "orders"("estado", "maestroId");

-- CreateIndex
CREATE UNIQUE INDEX "warranty_cases_codigo_key" ON "warranty_cases"("codigo");

-- CreateIndex
CREATE INDEX "audit_logs_entidad_entidadId_idx" ON "audit_logs"("entidad", "entidadId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "regiones" ADD CONSTRAINT "regiones_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regiones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regiones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regiones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regiones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regiones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_maestroId_fkey" FOREIGN KEY ("maestroId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranty_cases" ADD CONSTRAINT "warranty_cases_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
