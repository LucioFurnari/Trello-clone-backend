-- DropForeignKey
ALTER TABLE "WorkspaceUsers" DROP CONSTRAINT "WorkspaceUsers_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkspaceUsers" DROP CONSTRAINT "WorkspaceUsers_workspaceId_fkey";

-- AddForeignKey
ALTER TABLE "WorkspaceUsers" ADD CONSTRAINT "WorkspaceUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceUsers" ADD CONSTRAINT "WorkspaceUsers_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("workspaceId") ON DELETE CASCADE ON UPDATE CASCADE;
