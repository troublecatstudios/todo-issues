import * as core from '@actions/core'
import { SummaryTableRow } from '@actions/core/lib/summary';
import { getConfig } from './config';
import { subscribe } from './hooks';
import { getIssueUrl } from './action-context';

const factoids:string[] = [];
const issueSummaryTableItems:SummaryTableRow[] = [
  [{data: 'Issue', header: true}, {data: 'Title', header: true }, {data: 'Status', header: true}],
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

  subscribe('IssueCreated', async (payload): Promise<void> => {
    issueSummaryTableItems.push([`<a href="${getIssueUrl(payload.issueId)}" target="_blank">${payload.issueId}</a>`, `${payload.todo.title}`, 'CREATED']);
  });

  subscribe('IssueUpdated', async (payload): Promise<void> => {
    issueSummaryTableItems.push([`<a href="${getIssueUrl(payload.issueId)}" target="_blank">${payload.issueId}</a>`, `${payload.todo.title}`, 'UPDATED']);
  });

  subscribe('IssueClosed', async (payload): Promise<void> => {
    issueSummaryTableItems.push([`<a href="${getIssueUrl(payload.issueId)}" target="_blank">${payload.issueId}</a>`, '', 'CLOSED']);
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

