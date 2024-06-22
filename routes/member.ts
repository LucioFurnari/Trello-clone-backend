import { Router } from "express";
import { addMember } from "../controllers/member";

const router = Router();

router.post('/workspace/:workspace_id/member', addMember);

export { router as memberRouter }