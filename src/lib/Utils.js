// @flow

export default {
  detectOS(): 'windows' | 'macOS' | 'unix' | 'linux' | 'unknown' {
    const appVersion = navigator.appVersion;

    if (/Windows/.test(appVersion)) {
      return 'windows';
    }

    if (/Mac/.test(appVersion)) {
      return 'macOS';
    }

    if (/X11/.test(appVersion)) {
      return 'unix';
    }

    if (/Linux/.test(appVersion)) {
      return 'linux';
    }

    return 'unknown';
  },
  openUrl(url: string): void {
    window.open(url, '_blank').focus();
  },
  isUrl(value: string = ''): boolean {
    return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/.test(value);
  },
};
