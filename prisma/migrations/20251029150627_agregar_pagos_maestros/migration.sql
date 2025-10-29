-- CreateTable
CREATE TABLE "maestro_pagos" (
    "id" TEXT NOT NULL,
    "maestroId" TEXT NOT NULL,
    "orderId" TEXT,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodo" "MetodoPago" NOT NULL,
    "referencia" TEXT,
    "comprobanteUrl" TEXT,
    "notas" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maestro_pagos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "maestro_pagos" ADD CONSTRAINT "maestro_pagos_maestroId_fkey" FOREIGN KEY ("maestroId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maestro_pagos" ADD CONSTRAINT "maestro_pagos_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
