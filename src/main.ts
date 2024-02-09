import { loadConfig } from './config';
import { getCommentsByMarker, ITodo } from './todo-parser';
import { reconcileIssues } from './issues/reconciler';
import { error, info, verbose } from './logger';
import { setupListeners, writeSummary } from './summary-writer';

export const main = async function() {
  verbose(`starting up. loading configuration.`);
  setupListeners();
  const config = await loadConfig();

  info(`configuration loaded.`, { fileCount: config.files.length, markers: config.markers.map(m => m.matchText) });

  const items: ITodo[] = [];
  for(const file of config.files) {
    for(const marker of config.markers) {
      const todos = await getCommentsByMarker(marker, file);
      verbose(`file processed for markers.`, { filePath: file, marker: marker.matchText, commentCount: todos.length });
      // insert the todos into the items array
      items.splice(0,0, ...todos);
    }
  }
  info(`reconciling comments against GitHub issues.`, { commentCount: items.length });
  await reconcileIssues(items);
  await writeSummary();
};
