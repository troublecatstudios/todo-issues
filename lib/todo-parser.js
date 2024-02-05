"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentsByMarker = exports.compareHash = exports.HashSimilarity = exports.getHash = exports.InvalidHashInputFilePathError = exports.InvalidHashInputTitleError = exports.getTitleAndReference = exports.CommentMarker = exports.InvalidMarkersArgumentError = void 0;
const crypto_1 = require("crypto");
const promises_1 = require("fs/promises");
const prismjs_1 = __importDefault(require("prismjs"));
const grammar_1 = require("./grammar");
;
exports.InvalidMarkersArgumentError = 'Invalid markers specified. Unable to parse todos.';
class CommentMarker {
    constructor(marker) {
        if (!marker) {
            throw exports.InvalidMarkersArgumentError;
        }
        let [matchText, githubLabel] = marker.split(':');
        this.matchText = matchText.trim();
        this.githubLabel = githubLabel?.trim() ?? this.matchText;
    }
}
exports.CommentMarker = CommentMarker;
;
;
const markerCheck = /^\W+\s\w+(?: \[([^\]\s]+)\])?:(.*)$/img;
const getTitleAndReference = (contents) => {
    // https://stackoverflow.com/questions/4724701/regexp-exec-returns-null-sporadically
    // reset internal counter so regex matches correctly
    markerCheck.lastIndex = 0;
    return markerCheck.exec(contents);
};
exports.getTitleAndReference = getTitleAndReference;
exports.InvalidHashInputTitleError = 'Invalid hash input. Title must be specified.';
exports.InvalidHashInputFilePathError = 'Invalid hash input. FilePath must be specified.';
const getHash = ({ title, filePath }) => {
    if (!title || !title.trim()) {
        throw exports.InvalidHashInputTitleError;
    }
    if (!filePath || !filePath.trim()) {
        throw exports.InvalidHashInputFilePathError;
    }
    let filePathHash = (0, crypto_1.createHash)('md5').update(filePath).digest('hex').substr(0, 8);
    let titleHash = (0, crypto_1.createHash)('md5').update(title).digest('hex').substr(0, 8);
    let hash = `${filePathHash}:${titleHash}`;
    return hash;
};
exports.getHash = getHash;
var HashSimilarity;
(function (HashSimilarity) {
    HashSimilarity[HashSimilarity["SameFile"] = 0] = "SameFile";
    HashSimilarity[HashSimilarity["ExactMatch"] = 1] = "ExactMatch";
    HashSimilarity[HashSimilarity["NotSimilar"] = 2] = "NotSimilar";
})(HashSimilarity = exports.HashSimilarity || (exports.HashSimilarity = {}));
;
const compareHash = () => {
    return false;
};
exports.compareHash = compareHash;
const getCommentsByMarker = async (marker, filePath) => {
    if (!marker || marker.matchText.length === 0)
        return [];
    let tokens = await (0, grammar_1.getTokens)(filePath);
    let comments = tokens.filter((e) => e.token instanceof prismjs_1.default.Token &&
        e.token.type === 'comment' &&
        e.token.content.toString().includes(marker.matchText) &&
        e.token.content.toString().match(markerCheck));
    let todos = [];
    for (let comment of comments) {
        let todo = await createTodo(comment, marker, filePath);
        todos.push(todo);
    }
    return todos;
};
exports.getCommentsByMarker = getCommentsByMarker;
const createTodo = async (token, marker, filePath) => {
    const match = (0, exports.getTitleAndReference)(token.token.content.toString());
    const contents = (await (0, promises_1.readFile)(filePath)).toString().split('\n');
    let title = (match?.at(2) || '').trim();
    let hash = (0, exports.getHash)({ title, filePath });
    let issueNumber = (match?.at(1) || '').trim();
    return {
        line: token.line,
        endLine: token.endLine,
        type: marker,
        filePath,
        hash,
        issue: issueNumber,
        title,
        surroundingCode: contents.slice(Math.max(0, token.line - 3), Math.min(contents.length, token.endLine + 3)).join('\n')
    };
};
//# sourceMappingURL=todo-parser.js.map