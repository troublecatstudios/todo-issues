"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCodeForExtension = exports.getLanguages = void 0;
const promises_1 = require("fs/promises");
const js_yaml_1 = require("js-yaml");
const path_1 = require("path");
const linguistDir = (0, path_1.resolve)(__dirname, '../../node_modules/linguist');
const languagesYaml = (0, path_1.resolve)(linguistDir, './lib/linguist/languages.yml');
let languages = null;
const getLanguages = async () => {
    if (languages == null) {
        let yaml = await (0, promises_1.readFile)(languagesYaml);
        let languagesObject = (0, js_yaml_1.load)(yaml.toString());
        languages = languagesObject;
    }
    return languages;
};
exports.getLanguages = getLanguages;
const getCodeForExtension = async (extension) => {
    if (languages === null) {
        await (0, exports.getLanguages)();
    }
    for (var [name, lang] of Object.entries(languages)) {
        if (lang.extensions && lang.extensions.includes(extension)) {
            if (lang.aliases?.at(0)) {
                return lang.aliases?.at(0);
            }
            else {
                return lang.ace_mode;
            }
        }
    }
    return null;
};
exports.getCodeForExtension = getCodeForExtension;
//# sourceMappingURL=linguist-language-map.js.map