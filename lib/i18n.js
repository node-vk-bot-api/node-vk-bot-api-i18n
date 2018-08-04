const path = require('path')
const fs = require('./fs')

class I18n {
  constructor({ locales, defaultLocale, directory }) {
    if (!path.isAbsolute(directory)) {
      throw new Error('Directory path must be a absolute')
    }

    this.store = {}
    this.locales = locales
    this.defaultLocale = defaultLocale
    this.directory = directory
  }

  middleware() {
    return async (ctx, next) => {
      try {
        if (!Object.keys(this.store).length) {
          const paths = this.locales.map(locale => path.join(this.directory, `${locale}.json`))
          const buffers = await Promise.all(paths.map(locale => fs.readFile(locale)))

          buffers.forEach((buffer, i) => {
            this.store[this.locales[i]] = JSON.parse(`${buffer}`)
          })
        }

        if (!ctx.session.__locale) {
          ctx.session.__locale = this.defaultLocale
        }

        ctx.i18n = {
          __: (key, variables = {}) => {
            let message = this.store[ctx.session.__locale][key]

            if (!message) {
              return console.error(`Message not found: ${key}`)
            }

            Object.entries(variables).forEach(([key, value]) => {
              message = message.replace(new RegExp(`%${key}%`, 'g'), value)
            })

            return message
          },
        }

        Object.defineProperty(ctx.i18n, 'locale', {
          get: () => ctx.session.__locale,
          set: (locale) => {
            if (Object.values(this.locales).indexOf(locale) === -1) {
              return console.error(`Locale not found: ${locale}`)
            }

            ctx.session.__locale = locale
          },
        })

        next()
      } catch (err) {
        console.error(err)
      }
    }
  }
}

module.exports = I18n
