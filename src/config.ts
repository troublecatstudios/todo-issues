import * as core from '@actions/core';
import { CommentMarker } from './todo-parser';

const markerInput = 'markers';
const filesInput = 'files';

export type TodoIssuesConfig = {
  markers: CommentMarker[],
  files: string[],
};

export const loadConfig = (): TodoIssuesConfig => {
  const markers = core.getMultilineInput(markerInput);
  const files = core.getMultilineInput(filesInput);
  return {
    markers: parseMarkers(markers),
    files,
  };
};

const parseMarkers = (markers: string[]): CommentMarker[] => {
  return markers.map(m => new CommentMarker(m));
};

const config = loadConfig();
export default config;
