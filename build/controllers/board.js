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
exports.deleteBoard = exports.updateBoard = exports.createBoard = exports.getBoard = void 0;
const prismaClient_1 = __importDefault(require("../models/prismaClient"));
const express_validator_1 = require("express-validator");
function getBoard(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { boardId } = req.params;
        try {
            const board = yield prismaClient_1.default.board.findUnique({
                where: { boardId: boardId },
                include: {
                    lists: {
                        include: {
                            cards: true,
                        }
                    },
                }
            });
            if (!board)
                return res.status(404).json({ message: 'Board not found', error: true });
            return res.status(302).json(board);
        }
        catch (error) {
            console.error('Error getting board', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.getBoard = getBoard;
exports.createBoard = [
    (0, express_validator_1.body)('title').trim().notEmpty().withMessage('Title is required').escape(),
    (0, express_validator_1.body)('description').optional().trim().escape()
        .customSanitizer(value => {
        if (!value)
            return null; // Handle empty string and falsy values
        return value;
    }),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = (0, express_validator_1.validationResult)(req);
        const { title, description, coverImage, coverColor } = req.body;
        const { workspaceId } = req.params;
        if (!result.isEmpty()) {
            return res.status(400).json({ errorList: result.array() });
        }
        try {
            const board = yield prismaClient_1.default.board.create({
                data: {
                    title,
                    description,
                    coverImage,
                    coverColor,
                    workspaceId: workspaceId
                }
            });
            return res.status(201).json({ message: 'Board created', board: board });
        }
        catch (error) {
            console.error('Error creating board', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    })
];
exports.updateBoard = [
    (0, express_validator_1.body)('title').trim().notEmpty().withMessage('Title is required').escape(),
    (0, express_validator_1.body)('description').optional().trim().escape()
        .customSanitizer(value => {
        if (!value)
            return null; // Handle empty string and falsy values
        return value;
    }),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = (0, express_validator_1.validationResult)(req);
        const { title, description, coverImage, coverColor } = req.body;
        const { boardId } = req.params;
        if (!result.isEmpty()) {
            return res.status(400).json({ errorList: result.array() });
        }
        try {
            const updatedBoard = yield prismaClient_1.default.board.update({
                where: {
                    boardId: boardId,
                },
                data: {
                    title,
                    description,
                    coverImage,
                    coverColor,
                }
            });
            return res.status(200).json({ message: 'Board updated correctly', updatedBoard });
        }
        catch (error) {
            console.error('Error updating board', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    })
];
function deleteBoard(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { boardId } = req.params;
        try {
            const deletedBoard = yield prismaClient_1.default.board.delete({
                where: {
                    boardId: boardId,
                }
            });
            if (!deleteBoard) {
                return res.status(404).json({ message: 'Board not found', error: true });
            }
            return res.status(200).json({ message: 'Board deleted successfully', deletedBoard });
        }
        catch (error) {
            console.error('Error updating board', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.deleteBoard = deleteBoard;
