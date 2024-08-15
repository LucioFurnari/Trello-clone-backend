"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = require("./routes/index");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const { userRouter, workspaceRouter, boardRouter, listRouter, memberRouter, cardRouter, unsplashRouter } = index_1.index;
app.use((0, cors_1.default)({ credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api', userRouter, workspaceRouter, boardRouter, listRouter, memberRouter, cardRouter, unsplashRouter);
exports.server = app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
