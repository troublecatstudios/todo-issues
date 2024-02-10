import { publish, subscribe, unsubscribe, unsubscribeAll } from './../hooks';
import { createFakeTodo } from './createFakeTodo';

describe('the hooks event system', () => {

  const fakeUpdateEvent = { issueId: '#10', todo: createFakeTodo('TODO', 'abcde', '', '') };

  beforeEach(() => {
    unsubscribeAll();
  });
  describe('when an event is published', () => {
    it('should invoke any handlers subscribed to it', async () => {
      const mockHandler = jest.fn();
      subscribe('IssueUpdated', mockHandler);

      await publish('IssueUpdated', fakeUpdateEvent);
      expect(mockHandler).toHaveBeenCalled();
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it('should not invoke any handlers that were unsubscribed', async () => {
      const mockHandler = jest.fn();
      subscribe('IssueUpdated', mockHandler);

      unsubscribe('IssueUpdated', mockHandler);

      await publish('IssueUpdated', fakeUpdateEvent);
      expect(mockHandler).not.toHaveBeenCalled();
    });
  })
});
