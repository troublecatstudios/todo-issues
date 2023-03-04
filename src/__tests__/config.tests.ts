import { loadConfig } from '../config';
import * as mockCore from '../__mocks__/@actions/core';

describe('the configuration', () => {
  it('should get the markers from the GitHub Action libraries', async () => {
    const config = loadConfig();
    expect(config.markers).toHaveLength(0);
  });

  it('should load the files from the GitHub Action libraries', async () => {
    const config = loadConfig();
    expect(config.files).toHaveLength(0);
  });

  it('should parse any markers into CommentMarker objects', async () => {
    mockCore.getMultilineInputMock.mockReturnValue(['TODO:todo-label']);
    const config = loadConfig();
    expect(config.markers).toHaveLength(1);
    expect(config.markers[0].matchText).toBe('TODO');
    expect(config.markers[0].githubLabel).toBe('todo-label');
  });
});
