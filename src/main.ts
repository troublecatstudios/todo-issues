import config from './config';
import context from './repository-context';
export const NoMarkersSpecifiedError = 'No markers specified. Unable to parse todos.';

export const main = async function() {
  if (!config.markers || config.markers.length === 0) {
    throw NoMarkersSpecifiedError;
  }
};
