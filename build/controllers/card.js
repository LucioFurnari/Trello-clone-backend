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
exports.deleteCard = exports.updateCard = exports.createCard = exports.getCard = void 0;
const express_validator_1 = require("express-validator");
const prismaClient_1 = __importDefault(require("../models/prismaClient"));
// Get card
function getCard(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { cardId } = req.params;
        try {
            const card = yield prismaClient_1.default.card.findUnique({
                where: {
                    cardId: cardId
                }
            });
            if (!card)
                return res.status(404).json({ message: 'Card not found', error: true });
            return res.status(200).json({ message: 'Card found', card });
        }
        catch (error) {
            console.error('Error fetching workspace:', error);
            return res.status(500).json({ message: 'Internal server error', error: true });
        }
    });
}
exports.getCard = getCard;
// Create card
exports.createCard = [
    (0, express_validator_1.body)('title').trim().notEmpty().withMessage('Title is required').escape(),
    (0, express_validator_1.body)('description').optional().trim()
        .customSanitizer(value => {
        if (!value)
            return null; // Handle empty string and falsy values
        return value;
    }),
    (0, express_validator_1.body)('coverColor').optional().trim().escape()
        .customSanitizer(value => {
        if (!value)
            return null; // Handle empty string and falsy values
        return value;
    }),
    (0, express_validator_1.body)('coverImage').optional().trim().escape()
        .customSanitizer(value => {
        if (!value)
            return null; // Handle empty string and falsy values
        return value;
    }),
    (0, express_validator_1.body)('startDate').optional().trim()
        .customSanitizer(value => {
        if (!value)
            return null; // Handle empty string and falsy values
        return value;
    }),
    (0, express_validator_1.body)('dueDate').optional().trim()
        .customSanitizer(value => {
        if (!value)
            return null; // Handle empty string and falsy values
        return value;
    }),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { title, description, dueDate, coverColor, coverImage } = req.body;
        const { listId } = req.params;
        const result = (0, express_validator_1.validationResult)(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        try {
            const list = yield prismaClient_1.default.list.findUnique({
                where: {
                    listId: listId
                }
            });
            if (!list)
                return res.status(404).json({ message: 'List not found', error: true });
            const card = yield prismaClient_1.default.card.create({
                data: {
                    title: title,
                    listId: listId,
                    description: description,
                    dueDate: dueDate,
                    coverColor: coverColor,
                    coverImage: coverImage
                }
            });
            return res.status(201).json({ message: 'Card created', card });
        }
        catch (error) {
            console.error('Error fetching workspace:', error);
            return res.status(500).json({ message: 'Internal server error', error: true });
        }
    })
];
// Update card
exports.updateCard = [
    (0, express_validator_1.body)('title').trim().notEmpty().withMessage('Title is required').escape(),
    (0, express_validator_1.body)('description').optional()
        .customSanitizer(value => {
        if (!value)
            return null; // Handle empty string and falsy values
        return value;
    }),
    (0, express_validator_1.body)('coverColor').optional().trim().escape()
        .customSanitizer(value => {
        if (!value)
            return null; // Handle empty string and falsy values
        return value;
    }),
    (0, express_validator_1.body)('coverImage').optional().trim().escape()
        .customSanitizer(value => {
        if (!value)
            return null; // Handle empty string and falsy values
        return value;
    }),
    (0, express_validator_1.body)('startDate').optional().trim()
        .customSanitizer(value => {
        if (!value)
            return null; // Handle empty string and falsy values
        return value;
    }),
    (0, express_validator_1.body)('dueDate').optional().trim()
        .customSanitizer(value => {
        if (!value)
            return null; // Handle empty string and falsy values
        return value;
    }),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { title, description, dueDate, coverColor, coverImage } = req.body;
        const { cardId } = req.params;
        try {
            const card = yield prismaClient_1.default.card.update({
                where: {
                    cardId: cardId
                },
                data: {
                    title: title,
                    description: description,
                    dueDate: dueDate,
                    coverColor: coverColor,
                    coverImage: coverImage
                }
            });
            if (!card)
                return res.status(404).json({ message: 'Card not found', error: true });
            return res.status(201).json({ message: 'Card updated', card });
        }
        catch (error) {
            console.error('Error fetching workspace:', error);
            return res.status(500).json({ message: 'Internal server error', error: true });
        }
    })
];
// Delete card
function deleteCard(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { cardId } = req.params;
        try {
            const card = yield prismaClient_1.default.card.delete({
                where: {
                    cardId: cardId
                }
            });
            if (!card)
                return res.status(404).json({ message: 'Card not found' });
            return res.status(200).json({ message: 'Card deleted', card });
        }
        catch (error) {
            console.error('Error fetching workspace:', error);
            return res.status(500).json({ message: 'Internal server error', error: true });
        }
    });
}
exports.deleteCard = deleteCard;
