import { Router } from "express";
import { addMember } from "../controllers/member";

const router = Router();

router.post('/workspace/:workspaceId/member', addMember);

export { router as memberRouter }