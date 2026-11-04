CREATE TYPE "FoodOrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED');

CREATE TABLE "MenuCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MenuCategory_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "MenuCategory_name_key" ON "MenuCategory"("name");

CREATE TABLE "MenuItem" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "image" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "MenuItem_categoryId_isAvailable_idx" ON "MenuItem"("categoryId", "isAvailable");

CREATE TABLE "FoodOrder" (
    "id" SERIAL NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "guestId" INTEGER NOT NULL,
    "userId" INTEGER,
    "status" "FoodOrderStatus" NOT NULL DEFAULT 'PENDING',
    "subtotal" DECIMAL(10,2) NOT NULL,
    "tax" DECIMAL(10,2) NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ETB',
    "deliveryLocation" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "preparingAt" TIMESTAMP(3),
    "readyAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    CONSTRAINT "FoodOrder_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "FoodOrder_orderNumber_key" ON "FoodOrder"("orderNumber");
CREATE INDEX "FoodOrder_guestId_createdAt_idx" ON "FoodOrder"("guestId", "createdAt");
CREATE INDEX "FoodOrder_status_createdAt_idx" ON "FoodOrder"("status", "createdAt");

CREATE TABLE "FoodOrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "menuItemId" INTEGER,
    "name" TEXT NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "specialInstructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "FoodOrderItem_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "FoodOrderItem_orderId_idx" ON "FoodOrderItem"("orderId");
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MenuCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FoodOrder" ADD CONSTRAINT "FoodOrder_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FoodOrder" ADD CONSTRAINT "FoodOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "FoodOrderItem" ADD CONSTRAINT "FoodOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "FoodOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FoodOrderItem" ADD CONSTRAINT "FoodOrderItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO "MenuCategory" ("name", "description", "sortOrder", "updatedAt")
VALUES
  ('Breakfast', 'A generous start to your day.', 1, CURRENT_TIMESTAMP),
  ('Main Courses', 'Royal Palace favourites prepared to order.', 2, CURRENT_TIMESTAMP),
  ('Beverages', 'Fresh juices, coffee, tea, and cocktails.', 3, CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "MenuItem" ("categoryId", "name", "description", "price", "sortOrder", "updatedAt")
SELECT id, 'Royal Breakfast', 'Eggs, fresh fruit, pastry, and Ethiopian coffee.', 650, 1, CURRENT_TIMESTAMP
FROM "MenuCategory" WHERE name = 'Breakfast'
AND NOT EXISTS (SELECT 1 FROM "MenuItem" WHERE name = 'Royal Breakfast');
INSERT INTO "MenuItem" ("categoryId", "name", "description", "price", "sortOrder", "updatedAt")
SELECT id, 'Tibs Royale', 'Tender beef tibs with injera and seasonal salad.', 1200, 1, CURRENT_TIMESTAMP
FROM "MenuCategory" WHERE name = 'Main Courses'
AND NOT EXISTS (SELECT 1 FROM "MenuItem" WHERE name = 'Tibs Royale');
INSERT INTO "MenuItem" ("categoryId", "name", "description", "price", "sortOrder", "updatedAt")
SELECT id, 'Fresh Juice', 'Seasonal fruit juice served chilled.', 280, 1, CURRENT_TIMESTAMP
FROM "MenuCategory" WHERE name = 'Beverages'
AND NOT EXISTS (SELECT 1 FROM "MenuItem" WHERE name = 'Fresh Juice');
