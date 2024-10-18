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
exports.getMembersFromWorkspace = exports.addUserToWorkspace = void 0;
const prismaClient_1 = __importDefault(require("../models/prismaClient"));
// Add user to workspace
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
                        workspaceId: workspaceId,
                    },
                },
            });
            // Check if user is already in the workspace
            if (existingEntry) {
                return res.status(400).json({ error: 'User is already a member of this workspace' });
            }
            // Create new workspaceUsers
            const newWorkspaceUser = yield prismaClient_1.default.workspaceUsers.create({
                data: {
                    userId: userId,
                    workspaceId: workspaceId,
                    is_admin: false,
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
// Get all the members from a workspace
function getMembersFromWorkspace(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { workspaceId } = req.params;
        try {
            const membersList = yield prismaClient_1.default.workspaceUsers.findMany({
                where: {
                    workspaceId: workspaceId
                },
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            });
            // Flatten the result to extract only the user data
            const members = membersList.map(member => member.user);
            return res.status(200).json(members);
        }
        catch (error) {
            console.error('Error fetching workspace:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.getMembersFromWorkspace = getMembersFromWorkspace;
