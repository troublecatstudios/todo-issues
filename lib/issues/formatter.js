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
exports.formatIssueText = void 0;
const Eta = __importStar(require("eta"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const linguist_language_map_1 = require("./linguist-language-map");
const templateFile = path_1.default.resolve(__dirname, './.template.eta');
const templateContents = fs_1.default.readFileSync(templateFile).toString();
Eta.configure({
    cache: true,
    rmWhitespace: false,
    autoTrim: false,
});
const formatIssueText = async (todo) => {
    let ext = path_1.default.extname(todo.filePath);
    let props = {
        languageCode: await (0, linguist_language_map_1.getCodeForExtension)(ext) || ''
    };
    let text = Eta.render(templateContents, { ...todo, ...props });
    return text || '';
};
exports.formatIssueText = formatIssueText;
//# sourceMappingURL=formatter.js.map