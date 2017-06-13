import * as localForage from 'localforage';
import Mutex from 'await-mutex';

const KEYS_USED = 'KEYS_USED';
const mutex = new Mutex();

async function _record (key) {
  let unlock = await mutex.lock();
  // Send the key to a database somewhere, along with the current timestamp and the language that the key was requested in and whether the key was satisfied
  localForage.getItem(KEYS_USED)
    .then((keys) => {
      if (!keys) {
        keys = [];
      } else {
        keys = JSON.parse(keys);
      }
      keys.push({
        key,
        timestamp: Math.floor((new Date()).getTime() / 1000),
      });
      localForage.setItem(KEYS_USED, JSON.stringify(keys)).then(() => {
        unlock();
      });
    });
}

export default class Storage {
  constructor (logUrl, logInterval = 30) {
    this.logUrl = logUrl;

    setInterval(this._uploadTranslationsUsed, logInterval * 1000);
    window.addEventListener('unload', this._uploadTranslationsUsed, false);
  }

  _uploadTranslationsUsed () {
    localForage.getItem(KEYS_USED)
    .then((keys) => {
      if (!keys) {
        return;
      }
      // Nasty, this sends the data as text/plain
      navigator.sendBeacon(this.logUrl, JSON.stringify({ keys: JSON.parse(keys) }) );
      localForage.clear();
    });
  }

  record () {
    return _record(...arguments);
  }

}
