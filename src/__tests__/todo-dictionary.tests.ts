import { existsSync } from 'fs';
import { mkdtemp, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { CommentMarker, ITodo } from '../todo-parser';
import { createFakeTodo } from './createFakeTodo';
import { writeTodos, readTodos } from '../todo-dictionary';
import { rmRF } from '@actions/io';

describe('writeTodos', () => {
  let tmpDir = '';

  it('should exist', async () => {
    expect(writeTodos).toBeDefined();
  });

  it('should return a promise', async () => {
    let todoPath = join(tmpDir, 'todos.json');
    let task = writeTodos([], todoPath);
    expect(task).toHaveProperty('then');
  });

  describe('when the output directory exists', () => {
    beforeEach(async () => {
      tmpDir = await mkdtemp(join(tmpdir(), 'todo-issues-'));
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

  describe('when the output directory does not exist', () => {
    beforeEach(async () => {
      tmpDir = await mkdtemp(join(tmpdir(), 'todo-issues-'));
      await rmRF(tmpDir);
    });

    it('should create all the directories and write a JSON file to the path provided', async () => {
      let todoPath = join(tmpDir, 'todos.json');
      let fakeTodos: ITodo[] = [
        createFakeTodo('TODO', 'reference', 'This is an example todo', '/some/file.js')
      ];

      await writeTodos(fakeTodos, todoPath);

      let exists = existsSync(todoPath);

      expect(exists).toBe(true);
    });
  });
});

describe('readTodos', () => {
  let tmpDir = '';
  let todoPath = '';

  it('should exist', async () => {
    expect(readTodos).toBeDefined();
  });

  it('should return a promise', async () => {
    let task = readTodos(todoPath);
    expect(task).toHaveProperty('then');
  });

  describe('when the dictionary exists', () => {
    beforeEach(async () => {
      tmpDir = await mkdtemp(join(tmpdir(), 'todo-issues-'));
      todoPath = join(tmpDir, 'todos.json');
      let fakeTodos: ITodo[] = [
        createFakeTodo('TODO', 'reference', 'This is an example todo', '/some/file.js')
      ];
      let json = JSON.stringify({ todos: fakeTodos });
      await writeFile(todoPath, json);
    });

    it('should read a JSON file from the path provided', async () => {
      let { todos } = await readTodos(todoPath);

      expect(todos).toHaveLength(1);
    });
  });

  describe('when the file or directory does not exist', () => {
    beforeEach(async () => {
      tmpDir = await mkdtemp(join(tmpdir(), 'todo-issues-'));
      todoPath = join(tmpDir, 'todos.json');
    });

    it('should return a default dictionary object', async () => {
      let { todos } = await readTodos(todoPath);

      expect(todos).toHaveLength(0);
    });
  });
});
