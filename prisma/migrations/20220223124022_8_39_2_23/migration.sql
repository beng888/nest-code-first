/*
  Warnings:

  - You are about to drop the column `username` on the `Auth` table. All the data in the column will be lost.
  - Added the required column `email` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Auth" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Auth" ("id", "password") SELECT "id", "password" FROM "Auth";
DROP TABLE "Auth";
ALTER TABLE "new_Auth" RENAME TO "Auth";
CREATE UNIQUE INDEX "Auth_email_key" ON "Auth"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
