import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { ITodo } from "./todo-parser";
import RepositoryContext from './repository-context';

export type Dictionary = {
  todos: ITodo[]
};

export const defaultDictionaryPath = resolve(RepositoryContext.workingDirectory, './.github/todos.json');

export const writeTodos = async (todos: ITodo[], filePath: string = defaultDictionaryPath): Promise<void> => {
  let json = JSON.stringify({
    todos
  });

  await writeFile(filePath, json);
};

export const readTodos = async (filePath: string = defaultDictionaryPath): Promise<Dictionary> => {
  let json = (await readFile(filePath)).toString();
  let dict = JSON.parse(json) as Dictionary;
  dict.todos ||= [];
  return dict;
};
