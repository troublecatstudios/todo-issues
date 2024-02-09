import { loadConfig } from '../config';
import { reconcileIssues } from '../issues/reconciler';
import { writeSummary } from '../summary-writer';
import { CommentMarker } from '../todo-parser';
import { main } from './../main';
import { fixture } from './fixture-helper';

jest.mock('./../config');
jest.mock('./../issues/reconciler');
jest.mock('./../summary-writer');
jest.mock('@actions/glob');

const mockLoadConfig = loadConfig as jest.MockedFunction<typeof loadConfig>;
const mockReconcileIssues = reconcileIssues as jest.MockedFunction<typeof reconcileIssues>;
const mockWriteSummary = writeSummary as jest.MockedFunction<typeof writeSummary>;

describe('the main entrypoint', () => {
  it('exists', async () => {
    expect(main).toBeDefined();
  });

  it('calls the reconciler', async () => {
    const markers = [new CommentMarker('TODO')];
    const files = [fixture('todo-single-comment.js')];
    mockLoadConfig.mockReturnValue(Promise.resolve({
      markers,
      files,
      emoji: {
        issueTypes: { },
        statuses: { }
      }
    }));

    await main();

    expect(mockReconcileIssues).toHaveBeenCalled();
  });

  it ('calls writeSummary', async () => {
    const markers = [new CommentMarker('TODO')];
    const files = [fixture('todo-single-comment.js')];
    mockLoadConfig.mockReturnValue(Promise.resolve({
      markers,
      files,
      emoji: {
        issueTypes: { },
        statuses: { }
      }
    }));

    await main();

    expect(mockWriteSummary).toHaveBeenCalled();
  });
});
