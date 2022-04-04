import { readFile, writeFile } from "fs/promises";
import { ITodo } from "./todo-parser";

export type Dictionary = {
  todos: ITodo[]
};

export const writeTodos = async (todos: ITodo[], filePath: string): Promise<void> => {
  let json = JSON.stringify({
    todos
  });

  await writeFile(filePath, json);
};

export const readTodos = async (filePath: string): Promise<Dictionary> => {
  let json = (await readFile(filePath)).toString();
  return JSON.parse(json) as Dictionary;
};
