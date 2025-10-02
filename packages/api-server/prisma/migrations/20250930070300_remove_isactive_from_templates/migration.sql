-- DropIndex
DROP INDEX "templates_isActive_idx";

-- AlterTable
ALTER TABLE "templates" DROP COLUMN "isActive";
