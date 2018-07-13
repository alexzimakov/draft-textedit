import { detectOS } from '../utils';

describe('utils', () => {
  describe('detectOS()', () => {
    it('should returns `windows`', () => {
      Object.defineProperty(global.navigator, 'appVersion', {
        writable: true,
        value: '5.0 Windows Webkit',
      });
      expect(detectOS()).toBe('windows');
    });

    it('should returns `mac`', () => {
      Object.defineProperty(global.navigator, 'appVersion', {
        writable: true,
        value: '5.0 Mac OS X Webkit',
      });
      expect(detectOS()).toBe('mac');
    });

    it('should returns `unix`', () => {
      Object.defineProperty(global.navigator, 'appVersion', {
        writable: true,
        value: '5.0 X11 Webkit',
      });
      expect(detectOS()).toBe('unix');
    });

    it('should returns `linux`', () => {
      Object.defineProperty(global.navigator, 'appVersion', {
        writable: true,
        value: '5.0 Linux Webkit',
      });
      expect(detectOS()).toBe('linux');
    });

    it('should returns `unknown`', () => {
      Object.defineProperty(global.navigator, 'appVersion', {
        writable: true,
        value: '5.0 (KHTML, like Geko) Webkit',
      });
      expect(detectOS()).toBe('unknown');
    });
  });
});
