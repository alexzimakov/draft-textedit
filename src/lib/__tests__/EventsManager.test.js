import EventsManager from '../EventsManager';

const listener = jest.fn();
const listener1 = jest.fn();

describe('EventsManager', () => {
  afterEach(() => {
    listener.mockClear();
    listener1.mockClear();
  });

  it('should add event listeners', () => {
    expect(() => {
      EventsManager.addListener('test', listener);
      EventsManager.addListener('test', listener1);
    }).not.toThrow();
  });

  it('should not add event listener if listener is not a function', () => {
    EventsManager.addListener('test', 'plain text');

    expect(() => {
      EventsManager.dispatchEvent('test');
    }).not.toThrow();
  });

  it('should dispatch event and call event listeners', () => {
    EventsManager.dispatchEvent('test', 'arg1', 'arg2');

    expect(listener).toHaveBeenCalledWith('arg1', 'arg2');
    expect(listener1).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should not throw error when dispatch event but event does not exist', () => {
    expect(() => {
      EventsManager.dispatchEvent('not-existing-event', 'arg1');
    }).not.toThrow();
  });

  it('should remove event listener', () => {
    EventsManager.removeListener('test', listener1);
    EventsManager.dispatchEvent('test');

    expect(listener).toHaveBeenCalled();
    expect(listener1).not.toHaveBeenCalled();
  });

  it('should not throw error when remove listener and event does not exist', () => {
    expect(() => {
      EventsManager.removeListener('not-existing-event', listener1);
    }).not.toThrow();
  });

  it('should not throw error when remove listener but listener does not exist', () => {
    expect(() => {
      EventsManager.removeListener('test', jest.fn());
    }).not.toThrow();
  });
});
