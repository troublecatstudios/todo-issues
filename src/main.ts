
import * as core from '@actions/core';

const markerInput = 'markers';
const filesInput = 'files';

export const NoMarkersSpecifiedError = 'No markers specified. Unable to parse todos.';

export const main = async function() {
  let markers = core.getMultilineInput(markerInput);
  let files = core.getMultilineInput(filesInput);
  if (!markers || markers.length === 0 || markers.join('').length === 0) {
    throw NoMarkersSpecifiedError;
  }
};
