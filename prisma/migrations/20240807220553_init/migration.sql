-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "workspaceId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "visibilityPrivate" BOOLEAN NOT NULL DEFAULT true,
    "visibilityPublic" BOOLEAN NOT NULL DEFAULT false,
    "canEditAdmin" BOOLEAN NOT NULL DEFAULT false,
    "canEditUser" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("workspaceId")
);

-- CreateTable
CREATE TABLE "WorkspaceUsers" (
    "workspaceUsersId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "WorkspaceUsers_pkey" PRIMARY KEY ("workspaceUsersId")
);

-- CreateTable
CREATE TABLE "Board" (
    "boardId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverColor" TEXT,
    "coverImage" TEXT,
    "workspaceId" UUID NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("boardId")
);

-- CreateTable
CREATE TABLE "List" (
    "listId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "boardId" UUID NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("listId")
);

-- CreateTable
CREATE TABLE "Card" (
    "cardId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverColor" TEXT,
    "coverImage" TEXT,
    "startDate" DATE,
    "dueDate" TIMESTAMP(3),
    "listId" UUID NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("cardId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceUsers_userId_workspaceId_key" ON "WorkspaceUsers"("userId", "workspaceId");

-- CreateIndex
CREATE INDEX "Board_workspaceId_idx" ON "Board"("workspaceId");

-- CreateIndex
CREATE INDEX "List_boardId_idx" ON "List"("boardId");

-- CreateIndex
CREATE INDEX "Card_listId_idx" ON "Card"("listId");

-- AddForeignKey
ALTER TABLE "WorkspaceUsers" ADD CONSTRAINT "WorkspaceUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceUsers" ADD CONSTRAINT "WorkspaceUsers_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("workspaceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("workspaceId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("boardId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("listId") ON DELETE CASCADE ON UPDATE CASCADE;
