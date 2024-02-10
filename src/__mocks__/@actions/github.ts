import { OctokitOptions, OctokitPlugin } from '@octokit/core/dist-types/types';
import { GitHub } from '@actions/github/lib/utils';

type GitHubType = typeof import('@actions/github');

export const mockGitHub = {
  paginate: jest.fn(),
  rest: {
    issues: {
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    }
  }
};

export const getOctokit = (token: string, options?: OctokitOptions, ...additionalPlugins: OctokitPlugin[]):any => {
  return mockGitHub;
};
