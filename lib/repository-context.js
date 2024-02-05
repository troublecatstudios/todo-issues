"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
let eventJson = '';
if (process.env.GITHUB_EVENT_PATH &&
    (0, fs_1.existsSync)(process.env.GITHUB_EVENT_PATH)) {
    eventJson = (0, fs_1.readFileSync)(process.env.GITHUB_EVENT_PATH, 'utf8');
}
const event = eventJson ? JSON.parse(eventJson) : null;
const context = {
    workingDirectory: process.env.GITHUB_WORKSPACE || '',
    repositoryNodeId: process.env.GITHUB_REPO_NODE_ID ||
        (event && event.repository && event.repository.node_id),
    repositoryOwner: process.env.GITHUB_REPO_OWNER ||
        (event && event.repository && event.repository.full_name.split('/')[0]),
    repositoryName: process.env.GITHUB_REPO_NAME ||
        (event && event.repository && event.repository.full_name.split('/')[1]),
    defaultBranch: process.env.GITHUB_REPO_DEFAULT_BRANCH ||
        (event && event.repository && event.repository.default_branch),
};
exports.default = context;
//# sourceMappingURL=repository-context.js.map