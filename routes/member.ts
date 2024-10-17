import { Router } from "express";
import { addUserToWorkspace, getMembersFromWorkspace } from "../controllers/member";

const router = Router();

router.post('/workspace/:workspaceId/member', addUserToWorkspace);

router.get('/workspace/:workspaceId/members', getMembersFromWorkspace)

export { router as memberRouter }