"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberRouter = void 0;
const express_1 = require("express");
const member_1 = require("../controllers/member");
const router = (0, express_1.Router)();
exports.memberRouter = router;
router.post('/workspace/:workspaceId/member', member_1.addUserToWorkspace);
