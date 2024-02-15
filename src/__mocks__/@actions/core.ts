import { InputOptions } from '@actions/core';

type CoreType = typeof import('@actions/core');


export type MockSummaryParams = {
  addHeading?: jest.Mock<any, any>,
  addTable?: jest.Mock<any, any>,
  addList?: jest.Mock<any, any>,
  write?: jest.Mock<any, any>
};
class MockSummary {
  private _addHeading: jest.Mock<any, any>;
  private _addTable: jest.Mock<any, any>;
  private _addList: jest.Mock<any, any>;
  private _write: jest.Mock<any, any>;

  constructor({ addHeading, addTable, addList, write }: MockSummaryParams = {}) {
    this._addHeading = addHeading || jest.fn();
    this._addTable = addTable || jest.fn();
    this._addList = addList || jest.fn();
    this._write = write || jest.fn();
  }
  addHeading() {
    this._addHeading.apply(this, arguments);
    return this;
  }
  addTable() {
    this._addTable.apply(this, arguments);
    return this;
  }
  addList() {
    this._addList.apply(this, arguments);
    return this;
  }
  write() {
    this._write.apply(this, arguments);
  }
}

export const mockSummary:MockSummaryParams = {
  addHeading: jest.fn(),
  addTable: jest.fn(),
  addList: jest.fn(),
  write: jest.fn(),
};

export const summary = new MockSummary(mockSummary);

export const addInputMock = (inputName: string, mockValue: string) => {
  if (!inputHash[inputName]) inputHash[inputName] = jest.fn((): string => mockValue);
  inputHash[inputName].mockReturnValueOnce(mockValue);
};
export const addMultilineInputMock = (inputName: string, mockValue: string[]) => {
  if (!inputHash[inputName]) inputHash[inputName] = jest.fn((): string[] => []);
  inputHash[inputName].mockReturnValueOnce(mockValue);
};

const inputHash: Record<string, jest.Mock> = { };
export const getMultilineInput: CoreType['getMultilineInput'] = (name: string) => {
  if (inputHash[name]) return inputHash[name]();
  return undefined;
};

export const getInput: CoreType['getInput'] = (name: string, options?: InputOptions | undefined) => {
  if (inputHash[name]) return inputHash[name]();
  return undefined;
}

export const debugMock = jest.fn((): void => undefined);
export const debug: CoreType['debug'] = debugMock;

export const infoMock = jest.fn((): void => undefined);
export const info: CoreType['info'] = infoMock;

export const warningMock = jest.fn((): void => undefined);
export const warning: CoreType['warning'] = warningMock;

export const errorMock = jest.fn((): void => undefined);
export const error: CoreType['error'] = errorMock;
