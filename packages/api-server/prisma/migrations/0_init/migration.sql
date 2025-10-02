-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('QUEUED', 'SENT', 'DELIVERED', 'BOUNCED', 'FAILED', 'SUPPRESSED');

-- CreateTable
CREATE TABLE "idempotency_keys" (
    "idempotency_key" TEXT NOT NULL,
    "payload_hash" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "idempotency_keys_pkey" PRIMARY KEY ("idempotency_key")
);

-- CreateTable
CREATE TABLE "messages" (
    "message_id" TEXT NOT NULL,
    "tenant_id" TEXT,
    "to_json" JSONB NOT NULL,
    "subject" TEXT NOT NULL,
    "template_key" TEXT NOT NULL,
    "locale" TEXT,
    "variables_json" JSONB NOT NULL,
    "provider" TEXT,
    "provider_message_id" TEXT,
    "status" "MessageStatus" NOT NULL DEFAULT 'QUEUED',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "last_error" TEXT,
    "webhook_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "provider_events" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "raw_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provider_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idempotency_keys_expires_at_idx" ON "idempotency_keys"("expires_at");

-- CreateIndex
CREATE INDEX "messages_tenant_id_idx" ON "messages"("tenant_id");

-- CreateIndex
CREATE INDEX "messages_status_idx" ON "messages"("status");

-- CreateIndex
CREATE INDEX "messages_created_at_idx" ON "messages"("created_at");

-- CreateIndex
CREATE INDEX "messages_provider_idx" ON "messages"("provider");

-- CreateIndex
CREATE INDEX "messages_provider_message_id_idx" ON "messages"("provider_message_id");

-- CreateIndex
CREATE INDEX "provider_events_message_id_idx" ON "provider_events"("message_id");

-- CreateIndex
CREATE INDEX "provider_events_provider_idx" ON "provider_events"("provider");

-- CreateIndex
CREATE INDEX "provider_events_event_type_idx" ON "provider_events"("event_type");

-- CreateIndex
CREATE INDEX "provider_events_created_at_idx" ON "provider_events"("created_at");

