import * as path from 'path';
import { NoFilesInputSpecifiedError, NoMarkersInputSpecifiedError, loadConfig } from '../config';
import * as mockCore from '../__mocks__/@actions/core';

const endToEndPath = path.resolve(__dirname, './../../e2e');

describe('the configuration', () => {
  beforeEach(() => {
    // start the tests within the e2e directory
    process.chdir(endToEndPath);
  });

  describe('the markers property', () => {
    describe('when empty', () => {
      it('shoudl throw an error', async () => {
        try {
          const config = await loadConfig();
          fail();
        } catch (e) {
          expect(e).toBe(NoMarkersInputSpecifiedError);
        }
      });
    });

    it('should contain CommentMarker objects created from the markers input value', async () => {
      mockCore.addMultilineInputMock('markers', ['TODO:todo-label']);
      mockCore.addMultilineInputMock('files', ['**']);
      const config = await loadConfig();
      expect(config.markers).toHaveLength(1);
      expect(config.markers[0].matchText).toBe('TODO');
      expect(config.markers[0].githubLabel).toBe('todo-label');
    });
  });

  describe('the files property', () => {
    describe('when empty', () => {
      it('should throw an error', async () => {
        mockCore.addMultilineInputMock('markers', ['TODO:todo-label']); // set markers but leave files empty
        try {
          const config = await loadConfig();
          fail();
        } catch (e) {
          expect(e).toBe(NoFilesInputSpecifiedError);
        }
      });
    });

    it('should only contain the files within the e2e folder', async () => {
      mockCore.addMultilineInputMock('markers', ['TODO:todo-label']);
      mockCore.addMultilineInputMock('files', ['**']);
      const config = await loadConfig();
      expect(config.files).toHaveLength(7);
    });
  });
});
