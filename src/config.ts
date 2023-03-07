import * as core from '@actions/core';
import glob from '@actions/glob';
import { CommentMarker } from './todo-parser';

const markerInput = 'markers';
const filesInput = 'files';

export type TodoIssuesConfig = {
  markers: CommentMarker[],
  files: string[],
};

export const loadConfig = async (): Promise<TodoIssuesConfig> => {
  const markers = core.getMultilineInput(markerInput);
  const files = core.getMultilineInput(filesInput);
  const globber = await glob.create(files.join('\n'));
  const globbedFiles = await globber.glob();
  return {
    markers: parseMarkers(markers),
    files: globbedFiles,
  };
};

const parseMarkers = (markers: string[]): CommentMarker[] => {
  return markers.map(m => new CommentMarker(m));
};
