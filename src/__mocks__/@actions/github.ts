import { OctokitOptions, OctokitPlugin } from '@octokit/core/dist-types/types';
import { GitHub } from '@actions/github/lib/utils';
import { Octokit } from '@octokit/rest';

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
  return new Octokit();
};
