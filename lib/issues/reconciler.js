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
Object.defineProperty(exports, "__esModule", { value: true });
exports.reconcileIssues = void 0;
const github = __importStar(require("./github"));
const todo_dictionary_1 = require("./../todo-dictionary");
const formatter_1 = require("./formatter");
function initOptions(options) {
    const defaults = {
        dryRun: false,
        saveTodos: true,
    };
    return {
        ...defaults,
        ...options,
    };
}
const reconcileIssues = async (processedTodos, options) => {
    let dictionary = await (0, todo_dictionary_1.readTodos)();
    options = initOptions(options);
    let actions = [];
    for (var todo of dictionary.todos) {
        if (todo.issue) {
            let issue = await github.getIssue(parseInt(todo.issue));
            let codeMatch = processedTodos.filter(t => t.hash === todo.hash);
            if (issue) {
                if (issue.state === 'closed') {
                    continue;
                }
                if (codeMatch.length > 0) {
                    actions.push({ type: 'UPDATE', todo: codeMatch[0] });
                    continue;
                }
                actions.push({ type: 'CLOSE', todo: todo });
                continue;
            }
        }
        actions.push({ type: 'CREATE', todo: todo });
    }
    for (var todo of processedTodos) {
        let dictionaryMatch = dictionary.todos.filter(t => t.hash === todo.hash);
        if (dictionaryMatch.length > 0) {
            continue;
        }
        actions.push({ type: 'CREATE', todo: todo });
    }
    let todos = [];
    for (var { type, todo } of actions) {
        let body = await (0, formatter_1.formatIssueText)(todo);
        if (options?.dryRun) {
            console.log(`--------------`);
            console.log(`Action: ${type}`);
            console.log(`Todo JSON: ${JSON.stringify(todo)}`);
            if (type !== 'CLOSE') {
                console.log(`Issue Body:`);
                console.log(`${body}`);
            }
            console.log(`--------------`);
            if (type !== 'CLOSE')
                todos.push(todo);
            continue;
        }
        if (type === 'UPDATE') {
            await github.updateIssue(parseInt(todo.issue), {
                title: todo.title,
                body,
                labels: todo.type.githubLabel ? [todo.type.githubLabel] : undefined
            });
            todos.push(todo);
        }
        if (type === 'CREATE') {
            let issue = await github.createIssue({
                title: todo.title,
                body,
                labels: todo.type.githubLabel ? [todo.type.githubLabel] : undefined
            });
            if (issue) {
                todo.issue = issue;
            }
            todos.push(todo);
        }
        if (type === 'CLOSE') {
            await github.completeIssue(parseInt(todo.issue));
        }
    }
    if (options?.saveTodos) {
        await (0, todo_dictionary_1.writeTodos)(todos);
    }
};
exports.reconcileIssues = reconcileIssues;
//# sourceMappingURL=reconciler.js.map