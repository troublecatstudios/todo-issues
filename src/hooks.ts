import { ITodo } from "./todo-parser";

const _hookRegistry: Registry = {
  IssueCreated: [],
  IssueClosed: [],
  IssueUpdated: [],
  FileParsed: [],
};

type IssueHookPayload = {
  issueId: string,
};

type FileHookPayload = {
  filePath: string,
};

type TodoHookPayload = {
  todo: ITodo,
};

type ManyTodosHookPayload = {
  todos: ITodo[],
};

type HookPayloads = {
  IssueCreated: IssueHookPayload & TodoHookPayload,
  IssueClosed: IssueHookPayload & TodoHookPayload,
  IssueUpdated: IssueHookPayload & TodoHookPayload,
  FileParsed: FileHookPayload & ManyTodosHookPayload,
};
type Hooks = keyof HookPayloads;
type Registry = {
  [Property in keyof HookPayloads]: ((payload: HookPayloads[Property]) => Promise<void>)[];
};

export const publish = async <T extends Hooks>(hookName: T, payload: HookPayloads[T]): Promise<void> => {
  for(const ev of _hookRegistry[hookName]) {
    await ev(payload);
  }
};

export const subscribe = <T extends Hooks>(hookName: T, handler: (payload: HookPayloads[T]) => Promise<void>): void => {
  _hookRegistry[hookName].push(handler);
};

export const unsubscribe = <T extends Hooks>(hookName: T, handler: (payload: HookPayloads[T]) => Promise<void>): void => {
  _hookRegistry[hookName] = _hookRegistry[hookName].filter(ev => ev !== handler) as Registry[T];
};

export const unsubscribeAll = <T extends Hooks>(hookName?: T): void => {
  if (hookName) {
    _hookRegistry[hookName] = [];
  } else {
    for(const key of Object.keys(_hookRegistry)) {
      if (key) {
        unsubscribeAll(key as Hooks);
      }
    }
  }
};
