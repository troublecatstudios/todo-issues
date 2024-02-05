"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.NoMarkersSpecifiedError = void 0;
const config_1 = require("./config");
const todo_parser_1 = require("./todo-parser");
const reconciler_1 = require("./issues/reconciler");
exports.NoMarkersSpecifiedError = 'No markers specified. Unable to parse todos.';
const main = async function () {
    const config = await (0, config_1.loadConfig)();
    if (!config.markers || config.markers.length === 0) {
        throw exports.NoMarkersSpecifiedError;
    }
    const items = [];
    for (const file of config.files) {
        for (const marker of config.markers) {
            const todos = await (0, todo_parser_1.getCommentsByMarker)(marker, file);
            // insert the todos into the items array
            items.splice(0, 0, ...todos);
        }
    }
    await (0, reconciler_1.reconcileIssues)(items);
};
exports.main = main;
//# sourceMappingURL=main.js.map