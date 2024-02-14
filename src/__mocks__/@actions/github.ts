import { OctokitOptions, OctokitPlugin } from '@octokit/core/dist-types/types';
import { GitHub } from '@actions/github/lib/utils';
import { Octokit } from '@octokit/rest';
import { WebhookPayload } from '@actions/github/lib/interfaces';

type GitHubType = typeof import('@actions/github');
type GitHubContextType = GitHubType["context"];
type SetGitHubContextParams = Partial<GitHubContextType>;

let _payload: Partial<WebhookPayload> = {},
  _eventName: string = '',
  _sha: string = '',
  _ref: string = '',
  _workflow: string = '',
  _action: string = '',
  _actor: string = '',
  _job: string = '',
  _runId: number = 0,
  _runNumber: number = 0,
  _apiUrl: string = '',
  _serverUrl: string = '',
  _graphqlUrl: string = '',
  _issue: GitHubContextType["issue"] = {
    owner: '',
    repo: '',
    number: 0
  },
  _repo: GitHubContextType["repo"] = {
    owner: '',
    repo: '',
  };

class FakeGitHubContext implements GitHubContextType {
  get payload(): GitHubContextType["payload"] {
    return _payload;
  }
  get eventName(): GitHubContextType["eventName"] {
    return _eventName;
  }
  get sha(): GitHubContextType["sha"] {
    return _sha;
  }
  get ref(): GitHubContextType["ref"] {
    return _ref;
  }
  get workflow(): GitHubContextType["workflow"] {
    return _workflow;
  }
  get action(): GitHubContextType["action"] {
    return _action;
  }
  get actor(): GitHubContextType["actor"] {
    return _actor;
  }
  get job(): GitHubContextType["job"] {
    return _job;
  }
  get runId(): GitHubContextType["runId"] {
    return _runId;
  }
  get runNumber(): GitHubContextType["runNumber"] {
    return _runNumber;
  }
  get apiUrl(): GitHubContextType["apiUrl"] {
    return _apiUrl;
  }
  get serverUrl(): GitHubContextType["serverUrl"] {
    return _serverUrl;
  }
  get graphqlUrl(): GitHubContextType["graphqlUrl"] {
    return _graphqlUrl;
  }
  get issue(): GitHubContextType["issue"] {
    return _issue;
  }
  get repo(): GitHubContextType["repo"] {
    return _repo;
  }
}

export const context: FakeGitHubContext = new FakeGitHubContext();

export const setGitHubContext = ({ payload, eventName, sha, ref, workflow, action, actor, job, runId, runNumber, apiUrl, serverUrl, graphqlUrl, issue, repo }:SetGitHubContextParams = {}):void => {
  if (payload) _payload = payload;
  if (eventName) _eventName = eventName;
  if (sha) _sha = sha;
  if (ref) _ref = ref;
  if (workflow) _workflow = workflow;
  if (action) _action = action;
  if (actor) _actor = actor;
  if (job) _job = job;
  if (runId) _runId = runId;
  if (runNumber) _runNumber = runNumber;
  if (apiUrl) _apiUrl = apiUrl;
  if (serverUrl) _serverUrl = serverUrl;
  if (graphqlUrl) _graphqlUrl = graphqlUrl;
  if (issue) _issue = issue;
  if (repo) _repo = repo;
};

export const clearGitHubContext = ():void => {
  _payload = {};
  _eventName = '';
  _sha = '';
  _ref = '';
  _workflow = '';
  _action = '';
  _actor = '';
  _job = '';
  _runId = 0;
  _runNumber = 0;
  _apiUrl = '';
  _serverUrl = '';
  _graphqlUrl = '';
  _issue = { owner: '', repo: '', number: 0 };
  _repo = { owner: '', repo: '' };
};

export const getOctokit = (token: string, options?: OctokitOptions, ...additionalPlugins: OctokitPlugin[]):any => {
  return new Octokit();
};
