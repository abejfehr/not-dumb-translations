// TODO: Test this
import Statistics from './stats';

const MODE_ATTRIBUTE = 'attribute';
const MODE_TEXT = 'text';

export default class Translate {
  constructor ({ locale, fallbackLanguage, translations, mode, logUrl, logInterval }) {
    this.locale = locale ||  navigator.languages && navigator.languages[0] || // Chrome / Firefox
                             navigator.language ||   // All browsers
                             navigator.userLanguage; // IE <= 10
    this.fallbackLanguage = fallbackLanguage || 'en';
    this.mode = mode || MODE_TEXT;
    this.translations = translations;

    if (logUrl) {
      this.statistics = new Statistics(logUrl, logInterval);
    }

    switch (this.mode) {
      case MODE_TEXT:
      case MODE_ATTRIBUTE:
        // TODO: Add support for mode === 'attribute'
        this._updateDOMElements();
        this._listenForDOMChanges();
        break;
    }
  }

  _updateElementText (element) {
    for (const node of element.childNodes) {
      if (node.nodeName == '#text' && node.nodeValue.trim()) {
        const translation = this.string(node.nodeValue);
        if (node.nodeValue !== translation) {
          if (this.statistics) {
            this.statistics.record(node.nodeValue);
          }
          node.nodeValue = translation;
        }
      }
    }
  }

  _updateDOMElements () {
    const allElements = document.getElementsByTagName('*');
    for (const element of allElements) {
      this._updateElementText(element);
    }
  }

  _listenForDOMChanges () {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData') {
          this._updateElementText(mutation.target);
        }
      });
    });

    this.observer.observe(document.body, {
      characterData: true,
      subtree: true,
    });
  }

  _resolveKey (object, key, ...rest) {
    if (!object[key]) {
      return;
    }

    if (rest.length) {
      return this._resolveKey(object[key], ...rest);
    } else {
      return object[key];
    }
  }

  string (key) {
    const translationsForKey = this._resolveKey(this.translations, ...key.split('.'));

    if (!translationsForKey) {
      return key;
    }

    const [ languageKey, regionKey ] = this.locale.split('-');
    let translationsForLanguage = translationsForKey[languageKey];

    if (!translationsForLanguage) {
      translationsForLanguage = translationsForKey[this.fallback];
    }

    if (translationsForLanguage[regionKey]) {
      return translationsForLanguage[regionKey];
    } else {
      return translationsForLanguage.default;
    }
  }
}
