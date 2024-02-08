import * as path from 'path';
import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { ITodo } from "./todo-parser";
import RepositoryContext from './repository-context';
import { existsSync } from "fs";
import { mkdirP } from '@actions/io';

export type Dictionary = {
  todos: ITodo[]
};

export const defaultDictionaryPath = resolve(RepositoryContext.workingDirectory, './.github/todos.json');

export const writeTodos = async (todos: ITodo[], filePath: string = defaultDictionaryPath): Promise<void> => {
  let json = JSON.stringify({
    todos
  });

  if (!existsSync(path.dirname(filePath))) {
    await mkdirP(path.dirname(filePath));
  }

  await writeFile(filePath, json);
};

export const readTodos = async (filePath: string = defaultDictionaryPath): Promise<Dictionary> => {
  if (!existsSync(filePath)) {
    return {
      todos: []
    };
  }
  let json = (await readFile(filePath)).toString();
  let dict = JSON.parse(json) as Dictionary;
  dict.todos ||= [];
  return dict;
};
