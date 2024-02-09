import * as core from '@actions/core';
import * as glob from '@actions/glob';
import { CommentMarker } from './todo-parser';

const markerInput = 'markers';
const filesInput = 'files';
const emojiLookups = {
  issueTypes: {
    'bug': '🐛',
    'fixme': '🔨',
    'hack': '⚙️',
    'dragon': '🐉'
  },
  statuses: {
    'new': '🪄',
    'updated': '✏️',
    'closed': '✅'
  },
};

let _cachedConfig: TodoIssuesConfig | null = null;

const isInputEmpty = (input: string[] | undefined | null) => {
  if (!input || input.length === 0 || input.filter(i => !!i).length === 0) {
    return true;
  }
  return false;
};

export const NoFilesInputSpecifiedError = 'The files action input was not specified or is empty. You must specify at least one file glob pattern in order to process TODO comments.';
export const NoMarkersInputSpecifiedError = 'No markers specified. Unable to parse todos.';

export type TodoIssuesConfig = {
  markers: CommentMarker[],
  files: string[],
  emoji: {
    issueTypes: Record<string, string>,
    statuses: Record<string, string>,
  }
};

export const getConfig = async (): Promise<TodoIssuesConfig> => {
  if (!_cachedConfig) {
    _cachedConfig = await loadConfig();
  }
  return _cachedConfig;
};

export const loadConfig = async (): Promise<TodoIssuesConfig> => {
  const markers = core.getMultilineInput(markerInput);
  const files = core.getMultilineInput(filesInput);
  if (isInputEmpty(markers)) {
    throw NoMarkersInputSpecifiedError;
  }
  if (isInputEmpty(files)) {
    throw NoFilesInputSpecifiedError;
  }
  const globber = await glob.create(files.join('\n'), { matchDirectories: false });
  const globbedFiles = await globber.glob();
  _cachedConfig = {
    markers: parseMarkers(markers),
    files: globbedFiles,
    emoji: emojiLookups
  };
  return _cachedConfig;
};

const parseMarkers = (markers: string[]): CommentMarker[] => {
  return markers.map(m => new CommentMarker(m));
};
