import * as core from '@actions/core'
import { SummaryTableRow } from '@actions/core/lib/summary';
import { getConfig } from './config';
import { subscribe } from './hooks';

const factoids:string[] = [];
const issueSummaryTableItems:SummaryTableRow[] = [
  [{data: 'Issue', header: true}, {data: 'Status', header: true}],
];
const counters = {
  filesProcessed: 0,
  todosFound: 0,
};

export const setupListeners = (): void => {
  subscribe('FileParsed', async (payload) => {
    counters.filesProcessed++;
    counters.todosFound += payload.todos.length;
  });

  subscribe('IssueCreated', async (payload) => {
    issueSummaryTableItems.push([`${payload.issueId}`, 'CREATED']);
  });

  subscribe('IssueUpdated', async (payload) => {
    issueSummaryTableItems.push([`${payload.issueId}`, 'UPDATED']);
  });

  subscribe('IssueClosed', async (payload) => {
    issueSummaryTableItems.push([`${payload.issueId}`, 'CLOSED']);
  });
};


export const writeSummary =  async ():Promise<void> => {
  await core.summary
    .addHeading('TODO Issues Results')
    .addTable(issueSummaryTableItems)
    .addList([
      `${counters.filesProcessed} files were processed`,
      `${counters.todosFound} TODOs were found`
    ], false)
    .write()
};

