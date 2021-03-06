const TelegramBot = require('node-telegram-bot-api');
const ReplyManager = require('node-telegram-operation-manager').ReplyManager;
const totp = require('deathmoon-totp-generator');

// config
const token = ""
const chatID = ""
const secret = ""

const bot = new TelegramBot(token, { polling: true });
const reply = new ReplyManager();

bot.onText(/\/admin/, (msg) => {
  if((msg.from.id).toString() == chatID){
    const otp = totp(secret, { time: new Date() });
    bot.sendMessage(chatID, 'Please enter OTP.');
    reply.register(chatID, (result) => {
      if(result.text == otp){
        bot.sendMessage(chatID, 'Auth successful!');
        reply.register(chatID, (result) => {
          switch(result.text.toLowerCase()){
            case 'startwebserver':
              startWebServer();
              return { repeat: true };
            case 'stopwebserver':
              stopWebServer();
              return { repeat: true };
            case 'exit':
              bot.sendMessage(chatID, `Admin commands locked.`)
              return { repeat: false }
            default:
              bot.sendMessage(chatID, 'Unrecognized command!')
              return { repeat: true };
          }
        });
      } else {
        bot.sendMessage(chatID, 'Auth failed!');
      }
      return { repeat: false }
    });
  }
});


function startWebServer(){
  bot.sendMessage(chatID, 'Web server started!');
}

function stopWebServer(){
  bot.sendMessage(chatID, 'Web server stopped!');
}



bot.on('message', (msg) => {
  if (reply.expects(chatID)) {
    let { text, entities } = msg;
    reply.execute(chatID, { text, entities });
  }
});
