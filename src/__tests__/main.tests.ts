import { main, NoMarkersSpecifiedError } from './../main';

import * as mockCore from '../__mocks__/@actions/core';

describe('the main entrypoint', () => {
  it('exists', async () => {
    expect(main).toBeDefined();
  });

  it('throws an error if no markers are specified', async () => {
    try {
      await main();
      fail();
    } catch (e) {
      expect(e).toBe(NoMarkersSpecifiedError);
    }
  });

  it('')
});
