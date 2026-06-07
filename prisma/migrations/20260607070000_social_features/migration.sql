-- CreateTable
CREATE TABLE "PhotoComment" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "photoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhotoComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MomentPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MomentPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MomentPhoto" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "storagePath" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MomentPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestbookMessage" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuestbookMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PhotoComment_photoId_idx" ON "PhotoComment"("photoId");

-- CreateIndex
CREATE INDEX "PhotoComment_createdAt_idx" ON "PhotoComment"("createdAt");

-- CreateIndex
CREATE INDEX "MomentPost_postedAt_idx" ON "MomentPost"("postedAt");

-- CreateIndex
CREATE INDEX "MomentPhoto_postId_idx" ON "MomentPhoto"("postId");

-- CreateIndex
CREATE INDEX "MomentPhoto_order_idx" ON "MomentPhoto"("order");

-- CreateIndex
CREATE INDEX "GuestbookMessage_createdAt_idx" ON "GuestbookMessage"("createdAt");

-- CreateIndex
CREATE INDEX "GuestbookMessage_isPinned_idx" ON "GuestbookMessage"("isPinned");

-- AddForeignKey
ALTER TABLE "PhotoComment" ADD CONSTRAINT "PhotoComment_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MomentPhoto" ADD CONSTRAINT "MomentPhoto_postId_fkey" FOREIGN KEY ("postId") REFERENCES "MomentPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
