"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockGitHub = {
    createIssue: jest.fn().mockResolvedValue('1'),
    getIssue: jest.fn(),
    updateIssue: jest.fn(),
    completeIssue: jest.fn()
};
jest.mock('./../github', () => mockGitHub);
const mockInternalDictionary = {
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
const reconciler_1 = require("../reconciler");
const createFakeTodo_1 = require("../../__tests__/createFakeTodo");
const formatter_1 = require("./../formatter");
describe('reconcileIssues', () => {
    it('should exist', async () => {
        expect(reconciler_1.reconcileIssues).toBeDefined();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('if saveTodos is true', () => {
        let todo;
        let processedTodos;
        beforeEach(async () => {
            var preExistingTodo = (0, createFakeTodo_1.createFakeTodo)('BUG', 'hash2', 'Fix this bug', './another/file.js');
            todo = (0, createFakeTodo_1.createFakeTodo)('TODO', 'hash', 'Example title', './file/path.js');
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
            await (0, reconciler_1.reconcileIssues)(processedTodos, { saveTodos: true });
            expect(mockDictionary.writeTodos).toHaveBeenCalled();
        });
    });
    describe('given a marker exists in the code and the dictionary', () => {
        let todo;
        let processedTodos;
        beforeEach(async () => {
            todo = (0, createFakeTodo_1.createFakeTodo)('TODO', 'hash', 'Example title', './file/path.js');
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
                await (0, reconciler_1.reconcileIssues)(processedTodos);
                expect(mockGitHub.updateIssue).not.toHaveBeenCalled();
            });
            it('should update the issue if it is open', async () => {
                mockGitHub.getIssue.mockReturnValueOnce({
                    state: "open"
                });
                await (0, reconciler_1.reconcileIssues)(processedTodos);
                expect(mockGitHub.updateIssue).toHaveBeenCalled();
                expect(mockGitHub.createIssue).not.toHaveBeenCalled();
            });
            it('should create a new issue if the issue cannot be found', async () => {
                mockGitHub.getIssue.mockReturnValueOnce(null);
                await (0, reconciler_1.reconcileIssues)(processedTodos);
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
                await (0, reconciler_1.reconcileIssues)(processedTodos);
                expect(mockDictionary.readTodos).toHaveBeenCalled();
            });
            it('should call the text formatter', async () => {
                await (0, reconciler_1.reconcileIssues)(processedTodos);
                expect(mockFormatter.formatIssueText).toHaveBeenCalled();
                expect(mockFormatter.formatIssueText).toHaveBeenCalledWith(todo);
            });
            it('should create a GitHub issue', async () => {
                await (0, reconciler_1.reconcileIssues)(processedTodos);
                let body = await (0, formatter_1.formatIssueText)(todo);
                expect(mockGitHub.createIssue).toHaveBeenCalledWith({ title: todo.title, body, labels: ['TODO'] });
            });
            it('should update the dictionary entry with the GitHub Issue number', async () => {
                await (0, reconciler_1.reconcileIssues)(processedTodos);
                expect(todo.issue).toBe('1');
                expect(mockInternalDictionary.todos).toHaveLength(1);
                expect(mockDictionary.writeTodos).toHaveBeenCalled();
                expect(mockDictionary.writeTodos).toHaveBeenCalledWith([todo]);
            });
        });
    });
    describe('given a marker exists in the code but not in the dictionary', () => {
        let todo;
        let processedTodos;
        beforeEach(() => {
            todo = (0, createFakeTodo_1.createFakeTodo)('TODO', 'hash', 'Example title', './file/path.js');
            mockInternalDictionary.todos = [];
            processedTodos = [todo];
        });
        afterEach(() => {
            jest.clearAllMocks();
        });
        it('should call the text formatter', async () => {
            await (0, reconciler_1.reconcileIssues)(processedTodos);
            expect(mockFormatter.formatIssueText).toHaveBeenCalled();
            expect(mockFormatter.formatIssueText).toHaveBeenCalledWith(todo);
        });
        it('should create a GitHub issue', async () => {
            await (0, reconciler_1.reconcileIssues)(processedTodos);
            let body = await (0, formatter_1.formatIssueText)(todo);
            expect(mockGitHub.createIssue).toHaveBeenCalledWith({ title: todo.title, body, labels: ['TODO'] });
        });
        it('should add the correct issue label to the issue', async () => {
            todo = (0, createFakeTodo_1.createFakeTodo)('TODO', 'hash', 'Example title', './file/path.js', 'enhancement');
            mockInternalDictionary.todos = [];
            processedTodos = [todo];
            await (0, reconciler_1.reconcileIssues)(processedTodos);
            let body = await (0, formatter_1.formatIssueText)(todo);
            expect(mockGitHub.createIssue).toHaveBeenCalledWith({ title: todo.title, body, labels: ['enhancement'] });
        });
        it('should update the dictionary entry with the GitHub Issue number', async () => {
            await (0, reconciler_1.reconcileIssues)(processedTodos);
            expect(todo.issue).toBe('1');
            expect(mockDictionary.writeTodos).toHaveBeenCalled();
            expect(mockDictionary.writeTodos).toHaveBeenCalledWith([todo]);
        });
    });
    describe('if the issue cannot be created', () => {
        let todo;
        let processedTodos;
        beforeEach(() => {
            todo = (0, createFakeTodo_1.createFakeTodo)('TODO', 'hash', 'Example title', './file/path.js');
            mockInternalDictionary.todos = [];
            processedTodos = [todo];
        });
        afterEach(() => {
            jest.clearAllMocks();
        });
        it('should not update the dictionary', async () => {
            mockGitHub.createIssue.mockResolvedValue(null);
            await (0, reconciler_1.reconcileIssues)(processedTodos);
            expect(mockDictionary.readTodos).toHaveBeenCalled();
            expect(todo.issue).toBeFalsy();
            expect(mockGitHub.createIssue).toHaveBeenCalled();
        });
    });
    describe('given a marker exists only in the dictionary', () => {
        let todo;
        let processedTodos;
        beforeEach(async () => {
            todo = (0, createFakeTodo_1.createFakeTodo)('TODO', 'hash', 'Example title', './file/path.js');
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
                await (0, reconciler_1.reconcileIssues)(processedTodos);
                expect(mockGitHub.completeIssue).toHaveBeenCalled();
            });
        });
        it('should delete the dictionary entry', async () => {
            await (0, reconciler_1.reconcileIssues)(processedTodos);
            expect(mockDictionary.writeTodos).toHaveBeenCalled();
            expect(mockInternalDictionary.todos).not.toContainEqual({ hash: todo.hash });
        });
    });
});
//# sourceMappingURL=reconciler.tests.js.map