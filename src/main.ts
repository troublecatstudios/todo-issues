import { loadConfig } from './config';
import { getCommentsByMarker, ITodo } from './todo-parser';
import { reconcileIssues } from './issues/reconciler';
export const NoMarkersSpecifiedError = 'No markers specified. Unable to parse todos.';

export const main = async function() {
  const config = await loadConfig();
  if (!config.markers || config.markers.length === 0) {
    throw NoMarkersSpecifiedError;
  }

  const items: ITodo[] = [];
  for(const file of config.files) {
    for(const marker of config.markers) {
      const todos = await getCommentsByMarker(marker, file);
      items.splice(0,0, ...todos);
    }
  }
  await reconcileIssues(items);
};
