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
exports.loadConfig = void 0;
const core = __importStar(require("@actions/core"));
const glob_1 = __importDefault(require("@actions/glob"));
const todo_parser_1 = require("./todo-parser");
const markerInput = 'markers';
const filesInput = 'files';
const loadConfig = async () => {
    const markers = core.getMultilineInput(markerInput);
    const files = core.getMultilineInput(filesInput);
    const globber = await glob_1.default.create(files.join('\n'));
    const globbedFiles = await globber.glob();
    return {
        markers: parseMarkers(markers),
        files: globbedFiles,
    };
};
exports.loadConfig = loadConfig;
const parseMarkers = (markers) => {
    return markers.map(m => new todo_parser_1.CommentMarker(m));
};
//# sourceMappingURL=config.js.map