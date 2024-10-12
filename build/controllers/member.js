"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserToWorkspace = void 0;
const prismaClient_1 = __importDefault(require("../models/prismaClient"));
function addUserToWorkspace(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.body;
        const { workspaceId } = req.params;
        if (!userId || !workspaceId) {
            return res.status(400).json({ error: 'User ID and Workspace ID are required' });
        }
        try {
            const existingEntry = yield prismaClient_1.default.workspaceUsers.findUnique({
                where: {
                    userId_workspaceId: {
                        userId: userId,
                        workspaceId: workspaceId
                    },
                },
            });
            if (existingEntry) {
                return res.status(400).json({ error: 'User is already a member of this workspace' });
            }
            const newWorkspaceUser = yield prismaClient_1.default.workspaceUsers.create({
                data: {
                    userId: userId,
                    workspaceId: workspaceId
                },
            });
            return res.status(201).json(newWorkspaceUser);
        }
        catch (error) {
            console.error('Error adding user to workspace:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.addUserToWorkspace = addUserToWorkspace;
;
