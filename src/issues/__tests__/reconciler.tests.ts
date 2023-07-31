
const mockGitHub = {
  createIssue: jest.fn().mockResolvedValue('1'),
  getIssue: jest.fn(),
  updateIssue: jest.fn(),
  completeIssue: jest.fn()
};
jest.mock('./../github', () => mockGitHub);

const mockInternalDictionary: Dictionary = {
  todos: []
};
const mockDictionary = {
  readTodos: jest.fn().mockResolvedValue(mockInternalDictionary),
  writeTodos: jest.fn()
};
jest.mock('./../../todo-dictionary', () => mockDictionary);

const mockFormatter = {
  formatIssueText: jest.fn().mockReturnValue('Example formatted issue text')
};
jest.mock('./../formatter', () => mockFormatter);

import { Dictionary } from './../../todo-dictionary';
import { reconcileIssues } from '../reconciler';
import { createFakeTodo } from '../../__tests__/createFakeTodo';
import { ITodo } from '../../todo-parser';
import { formatIssueText } from './../formatter';

describe('reconcileIssues', () => {
  it('should exist', async () => {
    expect(reconcileIssues).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('if saveTodos is true', () => {
    let todo: ITodo;
    let processedTodos: ITodo[];

    beforeEach(async () => {
      var preExistingTodo = createFakeTodo('BUG', 'hash2', 'Fix this bug', './another/file.js');
      todo = createFakeTodo('TODO', 'hash', 'Example title', './file/path.js');
      mockInternalDictionary.todos = [todo, preExistingTodo];
      processedTodos = [todo];
      todo.issue = '1';
      preExistingTodo.issue = '2';
    });

    it('should write the todos to the dictionary', async () => {
      mockGitHub.getIssue.mockReturnValueOnce({
        state: 'open'
      })
      .mockReturnValueOnce({
        state: 'open'
      });
      await reconcileIssues(processedTodos, { saveTodos: true });
      expect(mockDictionary.writeTodos).toHaveBeenCalled();
    });
  });

  describe('given a marker exists in the code and the dictionary', () => {
    let todo: ITodo;
    let processedTodos: ITodo[];

    beforeEach(async () => {
      todo = createFakeTodo('TODO', 'hash', 'Example title', './file/path.js');
      mockInternalDictionary.todos = [todo];
      processedTodos = [todo];
    });

    describe('and it is linked to a GitHub Issue', () => {
      beforeEach(async () => {
        todo.issue = '1';
      });

      it('should not update the issue if it is closed', async () => {
        mockGitHub.getIssue.mockReturnValueOnce({
          state: "closed"
        });
        await reconcileIssues(processedTodos);
        expect(mockGitHub.updateIssue).not.toHaveBeenCalled();
      });

      it('should update the issue if it is open', async () => {
        mockGitHub.getIssue.mockReturnValueOnce({
          state: "open"
        });
        await reconcileIssues(processedTodos);
        expect(mockGitHub.updateIssue).toHaveBeenCalled();
        expect(mockGitHub.createIssue).not.toHaveBeenCalled();
      });

      it('should create a new issue if the issue cannot be found', async () => {
        mockGitHub.getIssue.mockReturnValueOnce(null);
        await reconcileIssues(processedTodos);
        expect(mockGitHub.getIssue).toHaveBeenCalled();
        expect(mockGitHub.createIssue).toHaveBeenCalled();
        expect(mockDictionary.writeTodos).toHaveBeenCalled();
      });
    });

    describe('and it is not linked to a GitHub Issue', () => {
      beforeEach(() => {
        todo.issue = '';
      });

      it('should load the todos from the dictionary', async () => {
        await reconcileIssues(processedTodos);
        expect(mockDictionary.readTodos).toHaveBeenCalled();
      });

      it('should call the text formatter', async () => {
        await reconcileIssues(processedTodos);
        expect(mockFormatter.formatIssueText).toHaveBeenCalled();
        expect(mockFormatter.formatIssueText).toHaveBeenCalledWith(todo);
      });

      it('should create a GitHub issue', async () => {
        await reconcileIssues(processedTodos);
        let body = await formatIssueText(todo);
        expect(mockGitHub.createIssue).toHaveBeenCalledWith({ title: todo.title, body, labels: ['TODO'] });
      });

      it('should update the dictionary entry with the GitHub Issue number', async () => {
        await reconcileIssues(processedTodos);
        expect(todo.issue).toBe('1');
        expect(mockInternalDictionary.todos).toHaveLength(1);
        expect(mockDictionary.writeTodos).toHaveBeenCalled();
        expect(mockDictionary.writeTodos).toHaveBeenCalledWith([todo]);
      });
    });
  });

  describe('given a marker exists in the code but not in the dictionary', () => {
    let todo: ITodo;
    let processedTodos: ITodo[];

    beforeEach(() => {
      todo = createFakeTodo('TODO', 'hash', 'Example title', './file/path.js');
      mockInternalDictionary.todos = [];
      processedTodos = [todo];
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call the text formatter', async () => {
      await reconcileIssues(processedTodos);
      expect(mockFormatter.formatIssueText).toHaveBeenCalled();
      expect(mockFormatter.formatIssueText).toHaveBeenCalledWith(todo);
    });

    it('should create a GitHub issue', async () => {
      await reconcileIssues(processedTodos);
      let body = await formatIssueText(todo);
      expect(mockGitHub.createIssue).toHaveBeenCalledWith({ title: todo.title, body, labels: ['TODO'] });
    });

    it('should add the correct issue label to the issue', async () => {
      todo = createFakeTodo('TODO', 'hash', 'Example title', './file/path.js', 'enhancement');
      mockInternalDictionary.todos = [];
      processedTodos = [todo];
      await reconcileIssues(processedTodos);
      let body = await formatIssueText(todo);
      expect(mockGitHub.createIssue).toHaveBeenCalledWith({ title: todo.title, body, labels: ['enhancement'] });
    });

    it('should update the dictionary entry with the GitHub Issue number', async () => {
      await reconcileIssues(processedTodos);
      expect(todo.issue).toBe('1');
      expect(mockDictionary.writeTodos).toHaveBeenCalled();
      expect(mockDictionary.writeTodos).toHaveBeenCalledWith([todo]);
    });
  });

  describe('if the issue cannot be created', () => {
    let todo: ITodo;
    let processedTodos: ITodo[];

    beforeEach(() => {
      todo = createFakeTodo('TODO', 'hash', 'Example title', './file/path.js');
      mockInternalDictionary.todos = [];
      processedTodos = [todo];
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should not update the dictionary', async () => {
      mockGitHub.createIssue.mockResolvedValue(null);
      await reconcileIssues(processedTodos);
      expect(mockDictionary.readTodos).toHaveBeenCalled();
      expect(todo.issue).toBeFalsy();
      expect(mockGitHub.createIssue).toHaveBeenCalled();
    });
  });

  describe('given a marker exists only in the dictionary', () => {
    let todo: ITodo;
    let processedTodos: ITodo[];

    beforeEach(async () => {
      todo = createFakeTodo('TODO', 'hash', 'Example title', './file/path.js');
      mockInternalDictionary.todos = [todo];
      processedTodos = [];
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('and it is linked to a GitHub Issue', () => {
      beforeEach(() => {
        todo.issue = '1';
        mockGitHub.getIssue.mockReturnValueOnce({
          state: "open"
        });
      });

      it('should close the GitHub issue', async () => {
        await reconcileIssues(processedTodos);
        expect(mockGitHub.completeIssue).toHaveBeenCalled();
      });
    });

    it('should delete the dictionary entry', async () => {
      await reconcileIssues(processedTodos);
      expect(mockDictionary.writeTodos).toHaveBeenCalled();
      expect(mockInternalDictionary.todos).not.toContainEqual({ hash: todo.hash });
    });
  });
});
