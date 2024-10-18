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
exports.deleteWorkSpace = exports.updateWorkspace = exports.getAllWorkSpaces = exports.getWorkSpace = exports.createWorkSpace = void 0;
const express_validator_1 = require("express-validator");
const prismaClient_1 = __importDefault(require("../models/prismaClient"));
// Create workspace function
exports.createWorkSpace = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('The name is required').escape(),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = (0, express_validator_1.validationResult)(req);
        const { name, description } = req.body;
        const userData = req.user;
        if (!userData)
            return res.status(400).json({ error: true, message: 'Token not provided' });
        if (result.isEmpty()) {
            const user = yield prismaClient_1.default.user.findUnique({
                where: {
                    id: userData === null || userData === void 0 ? void 0 : userData.id,
                }
            });
            if (!user) {
                return res.status(404).json({ message: 'User not found', error: true });
            }
            const workspace = yield prismaClient_1.default.workspace.create({
                data: {
                    name: name,
                    description: description
                },
                include: {
                    boards: true
                }
            });
            const workspaceUsers = yield prismaClient_1.default.workspaceUsers.create({
                data: {
                    userId: user.id,
                    workspaceId: workspace.workspaceId
                }
            });
            return res.status(201).json({ message: 'Workspace created', workspace, workspaceUsers });
        }
        return res.status(400).json({ error: true, errorList: result });
    })
];
// Get workspace function
function getWorkSpace(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { workspaceId } = req.params;
        const userData = req.user;
        try {
            const workspace = yield prismaClient_1.default.workspace.findUnique({
                where: { workspaceId: workspaceId },
                include: {
                    boards: true
                }
            });
            if (!workspace) {
                return res.status(404).json({ message: 'Workspace not found', error: true });
            }
            if (workspace.visibilityPublic) {
                return res.status(200).json({ workspace });
            }
            if (req.user) {
                const workspaceUser = yield prismaClient_1.default.workspaceUsers.findFirst({
                    where: {
                        userId: userData === null || userData === void 0 ? void 0 : userData.id,
                        workspaceId: workspaceId
                    }
                });
                if (workspace.visibilityPrivate && workspaceUser) {
                    return res.status(200).json({ workspace });
                }
            }
            return res.status(403).json({ message: 'Access denied', error: true });
        }
        catch (error) {
            console.error('Error fetching workspace:', error);
            return res.status(500).json({ message: 'Internal server error', error: true });
        }
    });
}
exports.getWorkSpace = getWorkSpace;
// Get all workspace from a user
function getAllWorkSpaces(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userData = req.user;
        try {
            const workspacesData = yield prismaClient_1.default.workspaceUsers.findMany({
                where: {
                    userId: userData === null || userData === void 0 ? void 0 : userData.id
                },
                include: {
                    workspace: {
                        include: {
                            boards: true
                        }
                    }
                }
            });
            // Extract the contents of each workspace
            const workspaces = workspacesData.map(ws => ws.workspace);
            return res.status(200).json({ workspaces });
        }
        catch (error) {
            console.error('Error fetching workspace:', error);
            return res.status(500).json({ message: 'Internal server error', error: true });
        }
    });
}
exports.getAllWorkSpaces = getAllWorkSpaces;
// Update workspace
exports.updateWorkspace = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('The name is required').escape(),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = (0, express_validator_1.validationResult)(req);
        const { workspaceId } = req.params;
        if (!result.isEmpty()) {
            return res.status(400).json({ errorList: result.array(), error: true });
        }
        const updatedWorkspace = yield prismaClient_1.default.workspace.update({
            where: { workspaceId: workspaceId },
            data: req.body
        });
        if (!exports.updateWorkspace) {
            return res.status(404).json({ message: 'Error, workspace not found', error: true });
        }
        return res.status(200).json({ message: 'Workspace updated', updatedWorkspace });
    })
];
// Delete workspace
function deleteWorkSpace(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { workspaceId } = req.params;
        try {
            const deleteWorkSpace = yield prismaClient_1.default.workspace.delete({
                where: {
                    workspaceId: workspaceId,
                },
            });
            return res.status(200).json({ deleteWorkSpace });
        }
        catch (error) {
            return res.status(400).json({ message: error, error: true });
        }
    });
}
exports.deleteWorkSpace = deleteWorkSpace;
