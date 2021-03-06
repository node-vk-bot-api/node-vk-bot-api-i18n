const VkBot = require('node-vk-bot-api');
const Session = require('node-vk-bot-api/lib/session');

const bot = new VkBot(process.env.TOKEN);

module.exports = {
  bot,
  Session,
  handleUpdate: (text = 'message', type = 'message_new') => new Promise((resolve) => {
    bot.next({
      message: {
        text,
        type,
        from_id: 145003487,
      },
    });

    setTimeout(resolve, 100);
  }),
};
