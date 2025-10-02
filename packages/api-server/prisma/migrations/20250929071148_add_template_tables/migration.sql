-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "variable_schema" JSONB NOT NULL,
    "json_structure" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_locales" (
    "id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "json_structure" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_locales_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "templates_key_key" ON "templates"("key");

-- CreateIndex
CREATE INDEX "templates_key_idx" ON "templates"("key");

-- CreateIndex
CREATE INDEX "templates_category_idx" ON "templates"("category");

-- CreateIndex
CREATE INDEX "templates_isActive_idx" ON "templates"("isActive");

-- CreateIndex
CREATE INDEX "template_locales_template_id_idx" ON "template_locales"("template_id");

-- CreateIndex
CREATE INDEX "template_locales_locale_idx" ON "template_locales"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "template_locales_template_id_locale_key" ON "template_locales"("template_id", "locale");

-- AddForeignKey
ALTER TABLE "template_locales" ADD CONSTRAINT "template_locales_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
