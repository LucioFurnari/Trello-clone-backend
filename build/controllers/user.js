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
exports.verifyToken = exports.logout = exports.loginUser = exports.updateUserData = exports.findUsers = exports.getUser = exports.createUser = void 0;
const express_validator_1 = require("express-validator");
const prismaClient_1 = __importDefault(require("../models/prismaClient"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
require("dotenv/config");
const SECRET_KEY = process.env.SECRET_KEY || process.env.DEV_SECRET_KEY;
exports.createUser = [
    (0, express_validator_1.body)('username').notEmpty().trim().withMessage('The user name is required').escape(),
    (0, express_validator_1.body)('email').notEmpty().trim().withMessage('The email is required').isEmail().withMessage('Have to be a valid email'),
    (0, express_validator_1.body)('password').notEmpty().trim().withMessage('The password is required').escape(),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, email, password } = req.body;
        const result = (0, express_validator_1.validationResult)(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: true, errorList: result.array() });
        const user = yield prismaClient_1.default.user.findUnique({
            where: {
                email: req.body.email,
            }
        });
        if (user)
            return res.status(409).json({ message: 'Email already have an account' });
        bcrypt_1.default.hash(password, 8, (_error, hash) => __awaiter(void 0, void 0, void 0, function* () {
            yield prismaClient_1.default.user.create({
                data: {
                    name: username,
                    email: email,
                    password: hash
                }
            });
        }));
        return res.status(200).json({
            message: 'User created!',
        });
    })
];
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            return res.status(400).json({ message: 'User not logged' });
        }
        const { username, email, id } = req.user;
        return res.status(200).json({ message: 'Profile info', user: { username, email, id } });
    });
}
exports.getUser = getUser;
;
// Function to find user or users list
function findUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }
        try {
            // Get the current user's email from req.user (set by the verifyToken middleware)
            const currentUserEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
            // Get the current user's name from req.user (set by the verifyToken middleware)
            const currentUserName = (_b = req.user) === null || _b === void 0 ? void 0 : _b.username;
            console.log(currentUserEmail);
            let users;
            if (query.includes('@')) {
                const isEmailValid = /\S+@\S+\.\S+/.test(query);
                if (!isEmailValid) {
                    return res.status(400).json({ error: 'Invalid email format' });
                }
                const user = yield prismaClient_1.default.user.findUnique({
                    where: { email: query },
                });
                users = user && user.email !== currentUserEmail ? [user] : [];
            }
            else {
                const usersList = yield prismaClient_1.default.user.findMany({
                    where: {
                        name: { contains: query, mode: 'insensitive' },
                    },
                });
                users = usersList.filter((user) => user.name !== currentUserName);
            }
            return res.status(200).json(users);
        }
        catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.findUsers = findUsers;
;
function updateUserData() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.updateUserData = updateUserData;
exports.loginUser = [
    (0, express_validator_1.body)('email').trim().notEmpty().withMessage('The user email is required').isEmail().withMessage('The email is not valid'),
    (0, express_validator_1.body)('password').trim().notEmpty().withMessage('The user password is required').escape(),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        const result = (0, express_validator_1.validationResult)(req);
        if (!result.isEmpty())
            return res.status(400).json({ error: true, errorList: result.array() });
        const user = yield prismaClient_1.default.user.findFirst({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found', error: true });
        }
        bcrypt_1.default.compare(password, user.password, (err, pass) => {
            if (err) {
                // Handle error
                console.error('Error comparing passwords:', err);
                return;
            }
            if (pass) {
                const token = jsonwebtoken_1.default.sign({ username: user.name, email: user.email, id: user.id }, SECRET_KEY, {
                    expiresIn: '1h',
                });
                res.cookie('access_token', token, {
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: false
                });
                return res.status(200).json({ message: 'User logged', token: token });
            }
            else {
                return res.status(401).json({ message: 'The password is incorrect' });
            }
        });
    })
];
function logout(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.clearCookie('access_token');
        return res.json({ message: 'Logout successful' });
    });
}
exports.logout = logout;
function verifyToken(req, res, next) {
    const token = req.cookies.access_token || req.body.access_token;
    if (token === 'undefined') {
        return next();
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
}
exports.verifyToken = verifyToken;
