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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // await prisma.user.create({
        //   data: {
        //     name: 'Alice',
        //     email: 'alice@prisma.io',
        //     password: '741123'
        //   },
        // })
        yield prisma.workspace.create({
            data: {
                name: 'This is another worspace :O',
                description: 'This is a description for the workspace',
            }
        });
        const allUsers = yield prisma.workspace.findMany();
        console.dir(allUsers, { depth: null });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((err) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(err);
    yield prisma.$disconnect();
    process.exit(1);
}));
