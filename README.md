Not Dumb Translations
=====================

Or, at least, I think they're pretty great.

Installing
----------

Simply type<sup>1</sup>:

    yarn add not-dumb-translations

<small>1. If you're using npm, you'll need to type `brew install yarn` first.</small>

Using
-----

### Example JS

    import Translate from 'not-dumb-translations';

    const translations = {
      "example-header": {
        "en": {
          "default": "This is an English title",
        },
        "nl": {
          "default": "Dit is een nederlandse titel"
        },
      },
      "example-description": {
        "en": {
          "default": "Because no other string exists for this key, only the English string will ever be shown."
        }
      }
    }

    let options = {
      translations,
    };

    let translate = new Translate(options);

### Example HTML

    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <h1>example-header</h1>
        <p>example-description</p>
      </body>
    </html>

Options
-------

There are a number of options that can be passed to the constructor to make your experience less dumb.

|Option|Effect|
|---|---|
|[`locale`](#locale)|If specified, it translates the DOM using different techniques. The available options are: `text`, `attribute`, and `manual`|
|[`fallbackLanguage`](#fallbackLanguage)|The language to fallback to when a key doesn't exist in a particular language. Each key must have a translation in the fallback language, or else only the key is shown instead|
|[`translations`](#translations)|The actual translation strings|
|[`mode`](#mode)|If specified, it translates the DOM using different techniques. The available options are: `text`, `attribute`, and `manual`|
|[`logUrl`](#logUrl)|The URL to post translation statistics to|
|[`logInterval`](#logUrl)|The interval at which to post translation statistics|

### locale
<a name="locale">

Specifies which locale to translate things to.

The default value for this option is whatever the browser's `navigator.language` is set to.

The format must be either:
* `xx` where `xx` is the language code, such as `en` for English
* `xx-XX` where `xx` is the language code and `XX` is the region code, such as `CA` for Canada

### fallbackLanguage
<a name="fallbackLanguage">

Specifies which language to fallback to if a key isn't available in the requested language.

The default value for this option is `en`.

### translations
<a name="translations">

The most important part: the translations for your application.

#### Format

The translations can be formatted however you wish, as long as it's exactly like this:

```
{
  "key-1": {
    "key-1-a": {
      "en": {
        "default": "Optimize Colour", // Normal English string
        "US": "Optimize Color", // 'murican English
        "GB": "Optimise Colour", // British
      }
    }
    "key-1-b": {
      "en": {
        "default": "Another thing."
      },
      "nl": {
        "default": "Een ander dingetje." // Usable if locale is set to `nl-XX`
      }
    }
  },
  "key-2": {
    "en": {
      "default": "Where is the library?"
    },
    "es": {
      "default": "¿Donde esta la biblioteca?" // Languages don't have to be specified everywhere
    }
  }
}
```

You can access nested keys using the dot operator, like so:

    Translate.string('key-1.key-1-b'); // "Another thing."

As you can probably guess, this means that certain key names are off-limits; namely, keys with dots in them won't work.

You're in charge of getting these translations into the browser. This is because now you can make the choice of storing this information as a JSON file (or many JSON files, if you want to split it up) or just a JS object.

### mode
<a name="mode">

Specifies how the translation should happen.

The default value for this option is `text`.

#### `text`

Replaces the contents of an element with it's translated value. For example:

    <p>header-default</p>

turns into something like

    <p>Some Header</p>

without any effort. This solves 2 problems:

1. No need to wrap every string in some kind of tag, like `<span>`
2. No more ugly empty tags in your HTML, and easy updating with `element.innerText = "another-translation-key"`, which is, again, automatically replaced.
3. Why should I alter my HTML markup just to support localization?

#### `attribute` (oops, this one is a work-in-progress)

Replaces the contents of an element's `translate` attribute with it's translated value. For example:

    <p translate="header-default"></p>

turns into

    <p translate="header-default">Some Header</p>

#### `manual`

Doesn't do anything to the DOM, ever. If you want to translate something, you'd have to do something like:

    let translatedString = translate.string('header-default');
    document.querySelector('p').innerText(translatedString);

But why would you want to do that? Just kidding, because you want to _extend_ this library to work with React/Angular, which this library doesn't support. Amazing.

### logUrl
<a name="logUrl">

Specifies where the translation statistics should be sent.

The default value for this option is `undefined`.

What are translation statistics? Well, my friend, it really is a list of keys and times they were translated. All you have to do is set up a server to receive this information in the form of JSON. The information can be used to find out which translation keys are stale, because stale keys are a waste of everyone's time, space, and bandwidth.

A POST request to the endpoint you specify could look like the following:

```
[
  {
    "key": "header-default",
    "timestamp": 1497322470
  },
  {
    "key": "header-hover-1",
    "timestamp": 1497322489
  }
]
```

Store it however you wish!

**Note:** No POST requests are made if no `logUrl` is specified.

### logInterval
<a name="logInterval">

Specifies how frequently (in seconds) the translation statistics are logged.

The default value for this option is `30`.

**Note:** No POST requests are made if no `logUrl` is specified or if there are no translation keys used within a given interval.

Contributing
------------

PRs and issues are welcome!
