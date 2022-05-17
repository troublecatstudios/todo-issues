
const mockGitHub = {
  createIssue: jest.fn().mockResolvedValue('1'),
  getIssue: jest.fn(),
  updateIssue: jest.fn()
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

import { Dictionary, readTodos, writeTodos } from './../../todo-dictionary';
import { createIssue } from './../github';
import { formatIssueText } from './../formatter';
import { reconcileIssues } from '../reconciler';
import { createFakeTodo } from '../../__tests__/createFakeTodo';
import { ITodo } from '../../todo-parser';

describe('reconcileIssues', () => {
  it('should exist', async () => {
    expect(reconcileIssues).toBeDefined();
  });

  describe('given a marker is found in the dictionary', () => {
    describe('and it is not linked to a GitHub Issue', () => {
      let todo: ITodo;
      beforeEach(async () => {
        todo = createFakeTodo('TODO', 'hash', 'Example title', './file/path.js');
        mockInternalDictionary.todos = [todo];
        todo.issue = '';
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('should load the todos from the dictionary', async () => {
        await reconcileIssues();
        expect(mockDictionary.readTodos).toHaveBeenCalled();
      });

      it('should call the text formatter', async () => {
        await reconcileIssues();
        expect(mockFormatter.formatIssueText).toHaveBeenCalled();
        expect(mockFormatter.formatIssueText).toHaveBeenCalledWith(todo);
      });

      it('should create a GitHub issue', async () => {
        await reconcileIssues();
        let body = await formatIssueText(todo);
        expect(createIssue).toHaveBeenCalledWith({ title: todo.title, body });
      });

      it('should update the dictionary entry with the GitHub Issue number', async () => {
        await reconcileIssues();
        expect(todo.issue).toBe('1');
        expect(mockInternalDictionary.todos).toHaveLength(1);
        expect(mockDictionary.writeTodos).toHaveBeenCalled();
        expect(mockDictionary.writeTodos).toHaveBeenCalledWith([todo]);
      });

      describe('if the issue cannot be created', () => {
        it('should not update the dictionary', async () => {
          mockGitHub.createIssue.mockRejectedValueOnce('some error');
          expect(todo.issue).toBeFalsy();
          expect(mockDictionary.writeTodos).not.toHaveBeenCalled();
        });
      });
    });

    describe('and it is linked to a GitHub Issue', () => {
      let todo: ITodo;
      beforeEach(async () => {
        todo = createFakeTodo('TODO', 'hash', 'Example title', './file/path.js');
        mockInternalDictionary.todos = [todo];
        todo.issue = '1';
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('should not update the issue if it is closed', async () => {
        mockGitHub.getIssue.mockReturnValueOnce({
          state: "closed"
        });
        await reconcileIssues();
        expect(mockGitHub.updateIssue).not.toHaveBeenCalled();
      });

      it('should update the issue if it is open', async () => {
        mockGitHub.getIssue.mockReturnValueOnce({
          state: "open"
        });
        await reconcileIssues();
        expect(mockGitHub.updateIssue).toHaveBeenCalled();
        expect(mockGitHub.createIssue).not.toHaveBeenCalled();
      });

      it('should create a new issue if the issue cannot be found', async () => {
        mockGitHub.getIssue.mockReturnValueOnce(null);
        await reconcileIssues();
        expect(mockGitHub.getIssue).toHaveBeenCalled();
        expect(mockGitHub.createIssue).toHaveBeenCalled();
        expect(mockDictionary.writeTodos).toHaveBeenCalled();
      });

      describe('and it has no match in the codebase', () => {
        it('should close the GitHub issue', async () => {

        });

        it('should delete the dictionary entry', async () => {

        });
      });
    });
  });
});
