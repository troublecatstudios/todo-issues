import * as core from '@actions/core'
import { ReconcileAction } from './issues/reconciler';
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

export const addSummaryFactoid = (fact: string):void => {
  factoids.push(fact);
};

export const addIssueResult = (issueNumber: number, status: ReconcileAction):void => {
  issueSummaryTableItems.push([`${issueNumber}`, status.type]);
};

export const setupListeners = (): void => {
  subscribe('FileParsed', async (payload) => {
    counters.filesProcessed++;
    counters.todosFound += payload.todos.length;
  });

  subscribe('IssueCreated', async (payload) => {
    issueSummaryTableItems.push([`${payload.issueNumber}`, 'CREATED']);
  });

  subscribe('IssueUpdated', async (payload) => {
    issueSummaryTableItems.push([`${payload.issueNumber}`, 'UPDATED']);
  });

  subscribe('IssueClosed', async (payload) => {
    issueSummaryTableItems.push([`${payload.issueNumber}`, 'CLOSED']);
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

