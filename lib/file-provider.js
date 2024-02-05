"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFiles = void 0;
const glob_1 = require("@actions/glob");
const getFiles = async function (workingDirectory, ...globs) {
    let globber = await (0, glob_1.create)(globs.join('\n'), { matchDirectories: false });
    let lastCwd = process.cwd();
    process.chdir(workingDirectory);
    let files = await globber.glob();
    return files;
};
exports.getFiles = getFiles;
//# sourceMappingURL=file-provider.js.map