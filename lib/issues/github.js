"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateIssue = exports.completeIssue = exports.createIssue = exports.getAllIssues = exports.getIssue = void 0;
const rest_1 = require("@octokit/rest");
const plugin_retry_1 = require("@octokit/plugin-retry");
const plugin_throttling_1 = require("@octokit/plugin-throttling");
const repository_context_1 = __importDefault(require("./../repository-context"));
const Octo = rest_1.Octokit.plugin(plugin_retry_1.retry, plugin_throttling_1.throttling);
const octokit = new Octo({
    auth: `token ${process.env.GITHUB_TOKEN}`,
    throttle: {
        onRateLimit: (retryAfter, options) => {
            octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`);
            if (options.request.retryCount === 0) {
                // only retries once
                octokit.log.info(`Retrying after ${retryAfter} seconds!`);
                return true;
            }
        },
        onAbuseLimit: (retryAfter, options) => {
            // does not retry, only logs a warning
            octokit.log.warn(`Abuse detected for request ${options.method} ${options.url}`);
        },
    },
    retry: {
        doNotRetry: ['429'],
    },
});
async function getIssue(issueNumber) {
    try {
        const issue = await octokit.issues.get({
            owner: repository_context_1.default.repositoryOwner,
            repo: repository_context_1.default.repositoryName,
            issue_number: issueNumber
        });
        return issue.data;
    }
    catch (e) {
        return null;
    }
}
exports.getIssue = getIssue;
async function getAllIssues() {
    const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
        owner: repository_context_1.default.repositoryOwner,
        repo: repository_context_1.default.repositoryName,
    });
    const notPrs = issues.filter(i => !i.pull_request);
    return notPrs;
}
exports.getAllIssues = getAllIssues;
async function createIssue(information) {
    try {
        const result = await octokit.rest.issues.create({
            owner: repository_context_1.default.repositoryOwner,
            repo: repository_context_1.default.repositoryName,
            title: information.title,
            body: information.body,
        });
        return result.data.number ? `#${result.data.number}` : null;
    }
    catch (e) {
        return null;
    }
}
exports.createIssue = createIssue;
async function completeIssue(issueNumber) {
    const result = await octokit.issues.update({
        owner: repository_context_1.default.repositoryOwner,
        repo: repository_context_1.default.repositoryName,
        issue_number: issueNumber,
        state: 'closed',
    });
}
exports.completeIssue = completeIssue;
async function updateIssue(issueNumber, information) {
    try {
        const result = await octokit.issues.update({
            owner: repository_context_1.default.repositoryOwner,
            repo: repository_context_1.default.repositoryName,
            issue_number: issueNumber,
            title: information.title,
            body: information.body,
        });
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.updateIssue = updateIssue;
//# sourceMappingURL=github.js.map