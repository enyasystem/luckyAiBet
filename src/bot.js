require('dotenv').config();
const { Telegraf } = require('telegraf');
const TonWeb = require('tonweb');
const tonweb = new TonWeb();
const { BOT_TOKEN, ADMIN_CHAT_ID } = process.env;

const bot = new Telegraf("6923930561:AAGmzS9TE0DkQ8K447SsdAh3SKB-Q0RjJTE");
console.log('Bot token:', BOT_TOKEN);

// Your TON wallet address here
const tonWalletAddress = 'UQAaQlxi2UijXkLWXNnc3XFvG6Gd2nrdKG9QLUUgXvXs2M-y';

// Function to check wallet balance
const checkWalletBalance = async () => {
    try {
        const address = new TonWeb.utils.Address(tonWalletAddress);
        const balance = await tonweb.provider.getBalance(address);
        return TonWeb.utils.fromNano(balance); // Convert nanoTON to TON
    } catch (err) {
        console.error('Error fetching balance:', err);
        return 0;
    }
};

// Function to process withdrawal
const processWithdrawal = async (userWalletAddress, amountTON) => {
    try {
        const wallet = new TonWeb.wallet.Wallet(tonweb.provider, { address: new TonWeb.utils.Address(tonWalletAddress) });
        const transaction = {
            toAddress: userWalletAddress,
            amount: TonWeb.utils.toNano(amountTON), // Convert TON to nanoTON
            seqno: null // Automatically fetch the next transaction ID
        };

        // Sign and send the transaction
        await wallet.sendTransfer({
            secretKey: 'YOUR_SECRET_KEY_HERE', // Your private key should be securely stored
            sendMode: 3, // Immediate transfer
            messages: [transaction]
        });

        return `✅ Withdrawal of ${amountTON} TON to ${userWalletAddress} was successful.`;
    } catch (err) {
        console.error('Error processing withdrawal:', err);
        return '❌ Withdrawal failed. Please try again later.';
    }
};

// Respond to the /start command
bot.start((ctx) => {
    const userName = ctx.from.first_name || ctx.from.username; // Get user's Telegram first name or username
    ctx.reply(`👋 Welcome, ${userName}! Here are the commands you can use:\n\n💼 /start - Start the bot\n📖 /help - Get help\n\nClick a button below to manage your account:`, {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: '💰 Deposit',
                    callback_data: 'deposit'
                }, {
                    text: '💸 Withdraw',
                    callback_data: 'withdraw'
                }, {
                    text: '💼 Check Balance',
                    callback_data: 'check_balance'
                }],
                [{
                    text: '🎮 Launch Game',
                    web_app: { url: 'https://example.com/game' } // Replace with your web app URL
                }]
            ]
        }
    });
});

// Respond to the /help command
bot.help((ctx) => {
    ctx.reply('💡 Here are the available commands:\n/start - Start the bot\n/help - Get help\n\nUse the buttons to manage your account.');
});

// Handle callback queries
bot.on('callback_query', async (ctx) => {
    const data = ctx.callbackQuery.data;

    if (data === 'deposit') {
        ctx.reply(`💰 To deposit TON, please send the amount to the following wallet address:\n\nTON Wallet: ${tonWalletAddress}\n\nOnce you have sent the amount, type /check_balance to confirm your deposit.`);
    } else if (data === 'withdraw') {
        ctx.reply('💸 Please send your TON wallet address and the amount you want to withdraw (in TON):');

        // Wait for user input (wallet address and amount)
        bot.on('text', async (ctx) => {
            const userInput = ctx.message.text.split(' ');
            if (userInput.length === 2) {
                const userWalletAddress = userInput[0];
                const amountTON = parseFloat(userInput[1]);

                if (isNaN(amountTON) || amountTON <= 0) {
                    ctx.reply('❌ Please provide a valid amount in TON.');
                } else {
                    const balance = await checkWalletBalance();
                    if (balance >= amountTON) {
                        const result = await processWithdrawal(userWalletAddress, amountTON);
                        ctx.reply(result);
                    } else {
                        ctx.reply('❌ Insufficient balance for the withdrawal.');
                    }
                }
            } else {
                ctx.reply('❌ Please provide the wallet address and amount in the correct format: `<wallet_address> <amount>`');
            }
        });
    } else if (data === 'check_balance') {
        const balance = await checkWalletBalance();
        ctx.reply(`💼 The current balance of the wallet is ${balance} TON.`);
    }

    ctx.answerCbQuery(); // Acknowledge callback queries to avoid errors
});

// Admin command
bot.command('admin', (ctx) => {
    if (ctx.from.id.toString() === ADMIN_CHAT_ID) {
        ctx.reply('👑 Welcome, Admin!');
    } else {
        ctx.reply('❌ You are not authorized to use this command.');
    }
});

// Handle unknown text commands
bot.on('text', (ctx) => {
    const messageText = ctx.message.text;
    ctx.reply(`❓ Sorry, I don't understand the command: "${messageText}". Type /help to see available commands.`);
});

// Start the bot
bot.launch()
    .then(() => console.log('🤖 Bot is up and running...'))
    .catch(err => console.error('❌ Failed to launch the bot', err));

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
