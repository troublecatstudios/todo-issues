"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTodos = exports.writeTodos = exports.defaultDictionaryPath = void 0;
const promises_1 = require("fs/promises");
const path_1 = require("path");
const repository_context_1 = __importDefault(require("./repository-context"));
exports.defaultDictionaryPath = (0, path_1.resolve)(repository_context_1.default.workingDirectory, './.github/todos.json');
const writeTodos = async (todos, filePath = exports.defaultDictionaryPath) => {
    let json = JSON.stringify({
        todos
    });
    await (0, promises_1.writeFile)(filePath, json);
};
exports.writeTodos = writeTodos;
const readTodos = async (filePath = exports.defaultDictionaryPath) => {
    let json = (await (0, promises_1.readFile)(filePath)).toString();
    let dict = JSON.parse(json);
    dict.todos || (dict.todos = []);
    return dict;
};
exports.readTodos = readTodos;
//# sourceMappingURL=todo-dictionary.js.map