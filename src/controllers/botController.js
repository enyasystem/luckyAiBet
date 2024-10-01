// src/controllers/botController.js
const User = require('../models/User');

async function findOrCreateUser(ctx) {
    try {
        const telegramId = ctx.from.id.toString();
        let user = await User.findOne({ telegramId });
        
        if (!user) {
            user = new User({
                telegramId,
                username: ctx.from.username || 'Unknown',
            });
            await user.save();
            ctx.reply('Welcome! Your profile has been created.');
        } else {
            ctx.reply('Welcome back!');
        }
    } catch (error) {
        console.error('Error finding or creating user:', error);
        ctx.reply('An error occurred while processing your request.');
    }
}

module.exports = {
    findOrCreateUser,
};
