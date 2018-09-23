import Utils from './Utils';

describe('Utils', () => {
  describe('detectOS()', () => {
    it('should returns `windows`', () => {
      Object.defineProperty(global.navigator, 'appVersion', {
        writable: true,
        value: '5.0 Windows Webkit',
      });
      expect(Utils.detectOS()).toBe('windows');
    });

    it('should returns `mac`', () => {
      Object.defineProperty(global.navigator, 'appVersion', {
        writable: true,
        value: '5.0 Mac OS X Webkit',
      });
      expect(Utils.detectOS()).toBe('macOS');
    });

    it('should returns `unix`', () => {
      Object.defineProperty(global.navigator, 'appVersion', {
        writable: true,
        value: '5.0 X11 Webkit',
      });
      expect(Utils.detectOS()).toBe('unix');
    });

    it('should returns `linux`', () => {
      Object.defineProperty(global.navigator, 'appVersion', {
        writable: true,
        value: '5.0 Linux Webkit',
      });
      expect(Utils.detectOS()).toBe('linux');
    });

    it('should returns `unknown`', () => {
      Object.defineProperty(global.navigator, 'appVersion', {
        writable: true,
        value: '5.0 (KHTML, like Geko) Webkit',
      });
      expect(Utils.detectOS()).toBe('unknown');
    });
  });

  describe('openUrl()', () => {
    it('should open URL in new tab', () => {
      const tabMock = { focus: jest.fn() };
      const dummyUrl = 'http://example.com';
      jest.spyOn(window, 'open').mockImplementation((url, target) => {
        expect(url).toBe(dummyUrl);
        expect(target).toBe('_blank');
        return tabMock;
      });

      Utils.openUrl(dummyUrl);

      expect(tabMock.focus).toHaveBeenCalled();
    });
  });

  describe('isUrl()', () => {
    it('should return true if URL is valid', () => {
      expect(Utils.isUrl('http://example.com/')).toBeTruthy();
      expect(Utils.isUrl('https://example.com')).toBeTruthy();
      expect(Utils.isUrl('example.com')).toBeTruthy();
      expect(Utils.isUrl('example.com?foo=bar')).toBeTruthy();
    });

    it('should return false if URL is invalid', () => {
      expect(Utils.isUrl()).toBeFalsy();
      expect(Utils.isUrl('')).toBeFalsy();
      expect(Utils.isUrl('foo')).toBeFalsy();
      expect(Utils.isUrl('http://example com')).toBeFalsy();
    });
  });
});
