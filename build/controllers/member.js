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
exports.addMember = void 0;
const prismaClient_1 = __importDefault(require("../models/prismaClient"));
function addMember(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { workspaceId } = req.params;
        const { userId } = req.body;
        // Validate input
        if (!workspaceId || !userId) {
            return res.status(400).json({ message: 'Workspace ID and User ID are required' });
        }
        try {
            // Add user to workspace
            const addedUser = yield prismaClient_1.default.workspaceUsers.create({
                data: {
                    is_admin: false,
                    userId,
                    workspaceId
                }
            });
            return res.status(201).json({ message: 'User added to the workspace', addedUser });
        }
        catch (error) {
            console.error('Error adding user to workspace:', error);
            // Handle different error types
            if (error instanceof Error) {
                return res.status(500).json({ message: 'Internal server error', error: error.message });
            }
            // Fallback in case error is not an instance of Error
            return res.status(500).json({ message: 'Internal server error', error: 'Unknown error' });
        }
    });
}
exports.addMember = addMember;
