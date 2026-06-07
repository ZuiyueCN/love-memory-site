-- 在 Supabase SQL Editor 中执行本文件，用来手动添加相册评论、组图动态和留言板功能。
-- 如果你已经通过 Prisma migrate 成功执行过 20260607070000_social_features，这个文件可以不执行。

CREATE TABLE IF NOT EXISTS "PhotoComment" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "photoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PhotoComment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "MomentPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MomentPost_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "MomentPhoto" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "storagePath" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MomentPhoto_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "GuestbookMessage" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GuestbookMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "PhotoComment_photoId_idx" ON "PhotoComment"("photoId");
CREATE INDEX IF NOT EXISTS "PhotoComment_createdAt_idx" ON "PhotoComment"("createdAt");
CREATE INDEX IF NOT EXISTS "MomentPost_postedAt_idx" ON "MomentPost"("postedAt");
CREATE INDEX IF NOT EXISTS "MomentPhoto_postId_idx" ON "MomentPhoto"("postId");
CREATE INDEX IF NOT EXISTS "MomentPhoto_order_idx" ON "MomentPhoto"("order");
CREATE INDEX IF NOT EXISTS "GuestbookMessage_createdAt_idx" ON "GuestbookMessage"("createdAt");
CREATE INDEX IF NOT EXISTS "GuestbookMessage_isPinned_idx" ON "GuestbookMessage"("isPinned");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'PhotoComment_photoId_fkey'
  ) THEN
    ALTER TABLE "PhotoComment"
      ADD CONSTRAINT "PhotoComment_photoId_fkey"
      FOREIGN KEY ("photoId") REFERENCES "Photo"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'MomentPhoto_postId_fkey'
  ) THEN
    ALTER TABLE "MomentPhoto"
      ADD CONSTRAINT "MomentPhoto_postId_fkey"
      FOREIGN KEY ("postId") REFERENCES "MomentPost"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" VARCHAR(36) NOT NULL,
    "checksum" VARCHAR(64) NOT NULL,
    "finished_at" TIMESTAMPTZ(6),
    "migration_name" VARCHAR(255) NOT NULL,
    "logs" TEXT,
    "rolled_back_at" TIMESTAMPTZ(6),
    "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
);

INSERT INTO "_prisma_migrations" (
    "id",
    "checksum",
    "finished_at",
    "migration_name",
    "logs",
    "rolled_back_at",
    "started_at",
    "applied_steps_count"
)
SELECT
    'social_features_manual_001',
    '0d08433a06d76e8454adf9ccff7cfe2c969d956f5e4282a0a56b4a727fbc3a5f',
    now(),
    '20260607070000_social_features',
    NULL,
    NULL,
    now(),
    1
WHERE NOT EXISTS (
    SELECT 1 FROM "_prisma_migrations"
    WHERE "migration_name" = '20260607070000_social_features'
);
