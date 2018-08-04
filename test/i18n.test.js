const { expect } = require('chai')
const path  = require('path')
const sinon = require('sinon')
const I18n = require('../lib/i18n')
const { bot, Session, handleUpdate } = require('./config.test.js')

const session = new Session()
const i18n = new I18n({
  locales: ['en', 'ru'],
  defaultLocale: 'en',
  directory: path.join(__dirname, 'locales')
})

bot.use(session.middleware())
bot.use(i18n.middleware())

describe('i18n', () => {
  afterEach(() => {
    bot.middlewares = bot.middlewares.slice(0, 2)
  })

  it('get default locale', async () => {
    const callback = sinon.fake()

    bot.on((ctx) => {
      callback()
      expect(ctx.i18n.locale).eq('en')
      expect(ctx.session.__locale).eq('en')
    })

    await handleUpdate()

    expect(callback.calledOnce).eq(true)
  })

  it('set locale', async () => {
    const callback = sinon.fake()

    bot.on((ctx) => {
      ctx.i18n.locale = 'ru'

      callback()
      expect(ctx.i18n.locale).eq('ru')
      expect(ctx.session.__locale).eq('ru')
    })

    await handleUpdate()

    expect(callback.calledOnce).eq(true)
  })

  it('generate message from template', async () => {
    const callback = sinon.fake()

    bot.on((ctx) => {
      const message = ctx.i18n.__('start', {
        name: 'Михаил'
      })

      callback()
      expect(message).eq('Привет, Михаил!')
    })

    await handleUpdate()

    expect(callback.calledOnce).eq(true)
  })

  it('generate message from template with dot notation', async () => {
    const callback = sinon.fake()

    bot.on((ctx) => {
      const message = ctx.i18n.__('errors.userNotFound')

      callback()
      expect(message).eq('Пользователь не найден')
    })

    await handleUpdate()

    expect(callback.calledOnce).eq(true)
  })
})
