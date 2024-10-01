const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    MONGO_URI: process.env.MONGO_URI,
    ADMIN_CHAT_ID: process.env.ADMIN_CHAT_ID,
};
