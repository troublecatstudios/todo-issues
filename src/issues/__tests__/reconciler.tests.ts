const mockGitHub = {
  createIssue: jest.fn().mockResolvedValue('1'),
  getIssue: jest.fn(),
  updateIssue: jest.fn(),
  completeIssue: jest.fn()
};
const mockIssueLibrary = {
  loadAllIssues: jest.fn().mockResolvedValue(null),
  getAllIssues: jest.fn(),
};
const mockFormatter = {
  formatIssueText: jest.fn().mockReturnValue('Example formatted issue text')
};

jest.mock('./../github', () => mockGitHub);
jest.mock('./../issue-library', () => mockIssueLibrary);
jest.mock('./../formatter', () => mockFormatter);

// IMPORTANT: these imports have to happen after the jest.mock() calls above otherwise
// the test runs will fail with ReferenceError: Cannot access 'XXXX' before initialization

import { reconcileIssues } from '../reconciler';
import { createFakeTodo } from '../../__tests__/createFakeTodo';
import { ITodo } from '../../todo-parser';
import { formatIssueText } from './../formatter';
import { GitHubIssueWithMetadata } from '../issue-library';
import { createFakeGitHubIssue, createFakeGitHubIssueWithMetadata } from './createFakeGitHubIssue';

describe('reconcileIssues', () => {
  const issue1 = createFakeGitHubIssueWithMetadata({ number: 1234 }, { hash: '12345' });
  const issue2 = createFakeGitHubIssueWithMetadata({ number: 12345 }, { });

  it('should exist', async () => {
    expect(reconcileIssues).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('given a marker exists in the code and the dictionary', () => {
    beforeEach(() => {
      mockIssueLibrary.getAllIssues.mockReturnValue([issue1]);
    });
    describe('and its title and body have not changed', () => {
      it('should not update the issue in GitHub', async () => {
        const todosFromFiles = [
          createFakeTodo({ hash: issue1.metadata.hash, title: issue1.title, filePath: issue1.metadata.filePath, line: issue1.metadata.line }, 'TODO')
        ];
        await reconcileIssues(todosFromFiles);
        expect(mockGitHub.updateIssue).not.toHaveBeenCalled();
      });
    });

    describe('and its title and body have changed', () => {
      // it('should update the issue in GitHub', async () => {
      //   const todosFromFiles = [
      //     createFakeTodo('TODO', '12345', 'this is a different title', './something2.js')
      //   ];
      //   await reconcileIssues(todosFromFiles);
      // });
    });
  });

  describe('given a marker exists in the code but not in the dictionary', () => {

  });

  describe('if the issue cannot be created', () => {

  });

  describe('given a marker exists only in the dictionary', () => {

  });
});
