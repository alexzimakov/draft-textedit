export function detectOS() {
  const appVersion = navigator.appVersion;

  if (/Windows/.test(appVersion)) {
    return 'windows';
  }

  if (/Mac/.test(appVersion)) {
    return 'mac';
  }

  if (/X11/.test(appVersion)) {
    return 'unix';
  }

  if (/Linux/.test(appVersion)) {
    return 'linux';
  }

  return 'unknown';
}
