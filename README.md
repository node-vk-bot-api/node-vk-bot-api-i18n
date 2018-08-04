[![node-vk-bot-api-i18n](https://img.shields.io/npm/v/node-vk-bot-api-i18n.svg?style=flat-square)](https://www.npmjs.com/package/node-vk-bot-api-i18n/)
[![node-vk-bot-api-i18n](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

# node-vk-bot-api-i18n

🇪🇺 I18n middleware for node-vk-bot-api.

## Install

```sh
$ npm i node-vk-bot-api-i18n -S
```

## Tests

Before you must set `TOKEN` and `GROUP_ID` in `process.env`.

```sh
$ npm test
```

## Usage

```js
const VkBot = require('node-vk-bot-api')
const Session = require('node-vk-bot-api/lib/session')
const I18n = require('node-vk-bot-api-i18n')
const path = require('path')

const bot = new VkBot({
  token: process.env.TOKEN,
  group_id: process.env.GROUP_ID
})
const session = new Session()
const i18n = new I18n({
  locales: ['en', 'ru'],
  defaultLocale: 'en',
  directory: path.join(__dirname, 'locales')
})

bot.use(session.middleware())
bot.use(i18n.middleware())

bot.command('/start', (ctx) => {
  ctx.reply(ctx.i18n.__('start', {
    name: 'Mikhail'
  }))
})

bot.startPolling()
```

## API

### Options

* `locales`: Languages list
* `defaultLocale`: Default language
* `directory`: Absolute path to locales directory

### Methods

* `ctx.i18n.locale=`: Setter for locale
* `ctx.i18n.locale`: Getter for locale
* `ctx.i18n.__(key, [variables])`: Generate message from template

### Locale file example

All files must be store as json.

```js
{
  "start": "Hello, %name%!",
  "errors": {
    "userNotFound": "User not found."
  }
}
```

## License

MIT.
