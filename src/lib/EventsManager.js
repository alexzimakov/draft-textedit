// @flow

const listeners: { [string]: Array<Function> } = {};

export default {
  addListener(eventName: string, listener: Function): void {
    if (typeof listener === 'function') {
      let eventListeners = listeners[eventName] || [];

      eventListeners = eventListeners.concat(listener);
      listeners[eventName] = eventListeners;
    }
  },
  removeListener(eventName: string, listener: Function): void {
    if (!listeners[eventName]) {
      return;
    }

    const index = listeners[eventName].indexOf(listener);

    if (index > -1) {
      listeners[eventName].splice(index, 1);
    }
  },
  dispatchEvent(eventName: string, ...args: Array<any>): void {
    if (!listeners[eventName]) {
      return;
    }

    for (let i = 0; i < listeners[eventName].length; i += 1) {
      const listener = listeners[eventName][i];
      listener(...args);
    }
  },
};
