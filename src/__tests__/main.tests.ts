import { main, NoMarkersSpecifiedError } from './../main';

describe('the main entrypoint', () => {
  it('exists', async () => {
    expect(main).toBeDefined();
  });

  it('throws an error if no markers are specified', async () => {
    jest.mock('./../config', () => {
      return { markers: [], files: [] }
    });
    try {
      await main();
      fail();
    } catch (e) {
      expect(e).toBe(NoMarkersSpecifiedError);
    }
  });
});
