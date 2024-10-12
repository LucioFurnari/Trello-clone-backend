import { Router } from "express";
import { addUserToWorkspace } from "../controllers/member";

const router = Router();

router.post('/workspace/:workspaceId/member', addUserToWorkspace);

export { router as memberRouter }