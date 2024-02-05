"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokens = exports.getGrammar = void 0;
const index_1 = __importDefault(require("prismjs/components/index"));
const prismjs_1 = __importStar(require("prismjs"));
const path_1 = require("path");
const promises_1 = require("fs/promises");
const getGrammar = (fileName) => {
    (0, index_1.default)();
    let extension = (0, path_1.extname)(fileName).substr(1);
    return prismjs_1.default.languages[extension];
};
exports.getGrammar = getGrammar;
const getTokens = async (fileName) => {
    let contents = (await (0, promises_1.readFile)(fileName)).toString();
    let tokens = (0, prismjs_1.tokenize)(contents, (0, exports.getGrammar)(fileName));
    let line = 1;
    let tokensWithLines = [];
    for (var t of tokens) {
        tokensWithLines.push({
            line,
            token: t,
            endLine: t instanceof prismjs_1.default.Token
                ? line + t.content.toString().split('\n').length - 1
                : line,
        });
        if (t instanceof prismjs_1.default.Token) {
            line += t.content.toString().split('\n').length - 1;
            continue;
        }
        line += t.split('\n').length - 1;
    }
    return tokensWithLines;
};
exports.getTokens = getTokens;
//# sourceMappingURL=grammar.js.map