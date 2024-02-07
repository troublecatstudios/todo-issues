import { loadConfig } from '../config';
import { reconcileIssues } from '../issues/reconciler';
import { CommentMarker } from '../todo-parser';
import { main } from './../main';
import { fixture } from './fixture-helper';

jest.mock('./../config');
jest.mock('./../issues/reconciler');
jest.mock('@actions/glob');

const mockLoadConfig = loadConfig as jest.MockedFunction<typeof loadConfig>;
const mockReconcileIssues = reconcileIssues as jest.MockedFunction<typeof reconcileIssues>;

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
    }));

    await main();

    expect(mockReconcileIssues).toHaveBeenCalled();
  });
});
