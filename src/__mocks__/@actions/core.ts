
type CoreType = typeof import('@actions/core');

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

export const debugMock = jest.fn((): void => undefined);
export const debug: CoreType['debug'] = debugMock;

export const infoMock = jest.fn((): void => undefined);
export const info: CoreType['info'] = infoMock;

export const warningMock = jest.fn((): void => undefined);
export const warning: CoreType['warning'] = warningMock;

export const errorMock = jest.fn((): void => undefined);
export const error: CoreType['error'] = errorMock;
