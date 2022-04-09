import * as Eta from 'eta';
import { ITodo } from "../todo-parser";
import path from 'path';
import fs from 'fs';
import { getCodeForExtension } from './linguist-language-map';

const templateFile = path.resolve(__dirname, './.template.eta');
const templateContents = fs.readFileSync(templateFile).toString();

Eta.configure({
  cache: true, // Make Eta cache templates
  rmWhitespace: false,
  autoTrim: false,
})

export const formatIssueText = async (todo: ITodo): Promise<string> => {
  let ext = path.extname(todo.filePath);
  let props = {
    languageCode: await getCodeForExtension(ext) || ''
  };
  let text = Eta.render(templateContents, { ...todo, ...props });
  return text || '';
};
