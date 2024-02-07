
type CoreType = typeof import('@actions/core');

export const getMultilineInputMock = jest.fn((): string[] => {
  return [];
});

export const getMultilineInput: CoreType['getMultilineInput'] = getMultilineInputMock;

export const debugMock = jest.fn((): void => undefined);
export const debug: CoreType['debug'] = debugMock;

export const infoMock = jest.fn((): void => undefined);
export const info: CoreType['info'] = infoMock;

export const warningMock = jest.fn((): void => undefined);
export const warning: CoreType['warning'] = warningMock;

export const errorMock = jest.fn((): void => undefined);
export const error: CoreType['error'] = errorMock;
