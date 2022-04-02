
type CoreType = typeof import('@actions/core');

export const getMultilineInputMock = jest.fn((): string[] => {
  return [];
});

export const getMultilineInput: CoreType['getMultilineInput'] = getMultilineInputMock;
