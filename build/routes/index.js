"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const user_1 = require("./user");
const workspace_1 = require("./workspace");
const board_1 = require("./board");
const list_1 = require("./list");
const member_1 = require("./member");
const card_1 = require("./card");
const unsplash_1 = require("./unsplash");
exports.index = {
    userRouter: user_1.userRouter,
    workspaceRouter: workspace_1.workspaceRouter,
    boardRouter: board_1.boardRouter,
    listRouter: list_1.listRouter,
    memberRouter: member_1.memberRouter,
    cardRouter: card_1.cardRouter,
    unsplashRouter: unsplash_1.unsplashRouter
};
