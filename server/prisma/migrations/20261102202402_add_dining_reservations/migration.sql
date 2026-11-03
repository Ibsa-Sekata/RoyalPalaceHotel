-- CreateEnum
CREATE TYPE "DiningReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "DiningReservation" (
    "id" SERIAL NOT NULL,
    "confirmationNumber" TEXT NOT NULL,
    "guestId" INTEGER NOT NULL,
    "restaurantName" TEXT NOT NULL,
    "reservationStart" TIMESTAMP(3) NOT NULL,
    "reservationEnd" TIMESTAMP(3) NOT NULL,
    "guests" INTEGER NOT NULL,
    "tableNumber" TEXT,
    "specialRequests" TEXT,
    "status" "DiningReservationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiningReservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiningReservation_confirmationNumber_key" ON "DiningReservation"("confirmationNumber");

-- CreateIndex
CREATE INDEX "DiningReservation_guestId_idx" ON "DiningReservation"("guestId");

-- CreateIndex
CREATE INDEX "DiningReservation_reservationStart_reservationEnd_idx" ON "DiningReservation"("reservationStart", "reservationEnd");

-- CreateIndex
CREATE INDEX "DiningReservation_restaurantName_reservationStart_reservati_idx" ON "DiningReservation"("restaurantName", "reservationStart", "reservationEnd");

-- AddForeignKey
ALTER TABLE "DiningReservation" ADD CONSTRAINT "DiningReservation_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
