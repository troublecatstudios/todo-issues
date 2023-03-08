import { loadConfig, TodoIssuesConfig } from '../config';
import { reconcileIssues, ReconcilerOptions } from '../issues/reconciler';
import { CommentMarker, ITodo } from '../todo-parser';
import { main, NoMarkersSpecifiedError } from './../main';
import { fixture } from './fixture-helper';
import glob, { create, Globber } from '@actions/glob';

jest.mock('./../config');
jest.mock('./../issues/reconciler');
jest.mock('@actions/glob');

const mockLoadConfig = loadConfig as jest.MockedFunction<typeof loadConfig>;
const mockReconcileIssues = reconcileIssues as jest.MockedFunction<typeof reconcileIssues>;

describe('the main entrypoint', () => {
  it('exists', async () => {
    expect(main).toBeDefined();
  });

  it('throws an error if no markers are specified', async () => {
    mockLoadConfig.mockReturnValue(Promise.resolve({
      markers: [],
      files: []
    }));
    try {
      await main();
      fail();
    } catch (e) {
      expect(e).toBe(NoMarkersSpecifiedError);
    }
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
