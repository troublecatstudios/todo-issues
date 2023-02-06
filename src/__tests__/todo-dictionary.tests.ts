import { existsSync } from 'fs';
import { mkdtemp, unlink, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { CommentMarker, ITodo } from '../todo-parser';
import { createFakeTodo } from './createFakeTodo';
import { writeTodos, readTodos } from '../todo-dictionary';

describe('writeTodos', () => {
  let tmpDir = '';

  beforeEach(async () => {
    tmpDir = await mkdtemp(join(tmpdir(), 'todo-issues-'));
  });

  it('should exist', async () => {
    expect(writeTodos).toBeDefined();
  });

  it('should return a promise', async () => {
    let todoPath = join(tmpDir, 'todos.json');
    let task = writeTodos([], todoPath);
    expect(task).toHaveProperty('then');
  });

  it('should write a JSON file to the path provided', async () => {
    let todoPath = join(tmpDir, 'todos.json');
    let fakeTodos: ITodo[] = [
      createFakeTodo('TODO', 'reference', 'This is an example todo', '/some/file.js')
    ];

    await writeTodos(fakeTodos, todoPath);

    let exists = existsSync(todoPath);

    expect(exists).toBe(true);
  });
});

describe('readTodos', () => {
  let tmpDir = '';
  let todoPath = '';

  beforeEach(async () => {
    tmpDir = await mkdtemp(join(tmpdir(), 'todo-issues-'));
    todoPath = join(tmpDir, 'todos.json');
    let fakeTodos: ITodo[] = [
      createFakeTodo('TODO', 'reference', 'This is an example todo', '/some/file.js')
    ];
    let json = JSON.stringify({ todos: fakeTodos });
    await writeFile(todoPath, json);
  });

  it('should exist', async () => {
    expect(readTodos).toBeDefined();
  });

  it('should return a promise', async () => {
    let task = readTodos(todoPath);
    expect(task).toHaveProperty('then');
  });

  it('should read a JSON file from the path provided', async () => {
    let { todos } = await readTodos(todoPath);

    expect(todos).toHaveLength(1);
  });
});
