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
exports.updatePosition = exports.deleteList = exports.createList = void 0;
const prismaClient_1 = __importDefault(require("../models/prismaClient"));
const express_validator_1 = require("express-validator");
// Create List function
exports.createList = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required').escape(),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = (0, express_validator_1.validationResult)(req);
        const { boardId } = req.params;
        const { name } = req.body;
        if (!result.isEmpty()) {
            return res.status(400).json({ errorList: result.array() });
        }
        const lastList = yield prismaClient_1.default.list.findMany({
            where: {
                boardId: boardId,
            },
            orderBy: {
                position: 'desc',
            }
        });
        if (lastList.length === 0) {
            const list = yield prismaClient_1.default.list.create({
                data: {
                    name: name,
                    boardId: boardId,
                    position: 0
                }
            });
            return res.status(200).json({ message: 'List created', list });
        }
        else {
            const list = yield prismaClient_1.default.list.create({
                data: {
                    name: name,
                    boardId: boardId,
                    position: lastList[0].position + 1,
                }
            });
            return res.status(200).json({ message: 'List created', list });
        }
    })
];
// Delete list function
function deleteList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { listId, boardId } = req.params;
        try {
            const existingList = yield prismaClient_1.default.list.findUnique({
                where: { listId: listId },
            });
            if (!existingList) {
                return res.status(404).json({ message: 'List not found' });
            }
            const list = yield prismaClient_1.default.list.delete({
                where: { listId: listId },
            });
            const updatedList = yield prismaClient_1.default.list.updateMany({
                where: {
                    AND: [
                        { boardId: boardId },
                        { position: { gte: list.position } },
                    ],
                },
                data: {
                    position: {
                        decrement: 1,
                    },
                },
            });
            return res.status(200).json({ message: 'List deleted', list, updatedList });
        }
        catch (error) {
            console.error('Error deleting list:', error);
            return res.status(500).json({ message: 'Internal server error', error: true });
        }
    });
}
exports.deleteList = deleteList;
// Update position function
function updatePosition(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { newList, newCards } = req.body;
        // const { boardId, listId } = req.params; moveTo,
        try {
            const updatePromises = newList.map((item, index) => prismaClient_1.default.list.update({
                where: { listId: item.listId },
                data: { position: index },
            }));
            const updateCards = newCards.map((card) => prismaClient_1.default.card.update({
                where: { cardId: card.cardId },
                data: { listId: card.listId }
            }));
            yield Promise.all(updatePromises);
            yield Promise.all(updateCards);
            res.status(200).json({ message: 'Order saved successfully' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error saving order' });
        }
    });
}
exports.updatePosition = updatePosition;
;
