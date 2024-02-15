const mockHooks = {
  publish: jest.fn(),
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  unsubscribeAll: jest.fn(),
};
jest.mock('./../hooks', () => mockHooks);

import { setupListeners, writeSummary } from './../summary-writer';
import { mockSummary } from '../__mocks__/@actions/core';

describe('summary-writer', () => {
  describe('setupListeners', () => {
    it('should bind to the FileParsed event', async () => {
      setupListeners();
      expect(mockHooks.subscribe).toHaveBeenCalledWith('FileParsed', expect.any(Function));
    });
    it('should bind to the IssueCreated event', async () => {
      setupListeners();
      expect(mockHooks.subscribe).toHaveBeenCalledWith('IssueCreated', expect.any(Function));
    });
    it('should bind to the IssueUpdated event', async () => {
      setupListeners();
      expect(mockHooks.subscribe).toHaveBeenCalledWith('IssueUpdated', expect.any(Function));
    });
    it('should bind to the IssueClosed event', async () => {
      setupListeners();
      expect(mockHooks.subscribe).toHaveBeenCalledWith('IssueClosed', expect.any(Function));
    });
  });

  describe('writeSummary', () => {
    it('should add a header to the summary', async () => {
      await writeSummary();
      expect(mockSummary.addHeading).toHaveBeenCalledWith('TODO Issues Results');
    });

    it('should add a table with headers for the Issue, Title and Action', async () => {
      await writeSummary();
      expect(mockSummary.addTable).toHaveBeenCalledWith([
        [{data: 'Issue', header: true}, {data: 'Title', header: true }, {data: 'Status', header: true}],
      ]);
    });

    it('should add a list containing the number of files and todos processed', async () => {
      await writeSummary();
      expect(mockSummary.addList).toHaveBeenCalledWith([
        `0 files were processed`,
        `0 TODOs were found`
      ], false);
    });

    it('should call the write method to output the summary', async () => {
      await writeSummary();
      expect(mockSummary.write).toHaveBeenCalled();
    })
  });
});
