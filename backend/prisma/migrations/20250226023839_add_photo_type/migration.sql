/*
  Warnings:

  - Added the required column `photo_type` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "photo_type" TEXT NOT NULL;
