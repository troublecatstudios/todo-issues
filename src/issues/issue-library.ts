import * as github from './github';

export const loadAllIssues = async (): Promise<void> => {
  const issues = await github.getAllIssues();

};
