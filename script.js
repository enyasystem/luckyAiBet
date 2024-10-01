
//Dark Mode
const darkModeToggle = document.querySelector('.dark-mode-toggle');
darkModeToggle.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    this.classList.toggle('fa-sun');
    this.classList.toggle('fa-moon');
});

//==========================
//DEPOSIT BUTTON REDIRECTION
//==========================

//==========================
//GAME BUTTON REDIRECTION
//==========================
document.querySelector('.play-game-button').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default anchor behavior
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('highlight'));
    const gamesNav = document.querySelector('[data-target="games-section"]');
    if (gamesNav) {
        gamesNav.classList.add('highlight');
    }

    // Hide all sections
    document.querySelectorAll('.section').forEach(section => section.style.display = 'none');
    // Show the games section
    const gamesSection = document.getElementById('games-section');
    if (gamesSection) {
        gamesSection.style.display = 'block';
    }
});
// Nav item click event to show/hide sections
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function () {
        // Remove highlight from all nav items
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('highlight'));
        // Highlight clicked nav item
        item.classList.add('highlight');

        // Hide all sections
        document.querySelectorAll('.section').forEach(section => section.style.display = 'none');
        // Show corresponding section
        const targetSection = document.getElementById(item.getAttribute('data-target'));
        if (targetSection) {
            targetSection.style.display = 'block';
        }
    });
});

// Initial display settings (show leaderboard by default)
document.getElementById('leaderboard-section').style.display = 'block';


// let isWalletConnected = false;
// let balance = 100; // Initial balance
// const MIN_DEPOSIT = 100;
// const MIN_WITHDRAWAL = 100;

function updateBalanceDisplay() {
    const balanceElements = document.querySelectorAll('.balance-display');
    balanceElements.forEach(element => {
        element.textContent = Math.floor(balance); // Display balance as whole number
    });
}

// //======================
// //Wallet Profile Section
//=========================
let isWalletConnected = false;
let balance = parseInt(localStorage.getItem('balance')) || 0 ; // Use stored balance or default to 100 TON
const MIN_DEPOSIT = 100;
const MIN_WITHDRAWAL = 100;

function updateBalanceDisplay() {
    const balanceElements = document.querySelectorAll('.balance-display');
    balanceElements.forEach(element => {
        element.textContent = Math.floor(balance); // Display balance as whole number
    });
}

function updateWalletButton() {
    const connectButton = document.getElementById('connect-wallet');
    connectButton.style.display = isWalletConnected ? 'none' : 'inline-block';
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function displayMessage(message, isSuccess) {
    const messageElement = document.getElementById('message-display');
    messageElement.textContent = message;
    messageElement.className = isSuccess ? 'success-message' : 'error-message';
    messageElement.style.display = 'block';
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

function openDepositModal() {
    openModal('deposit-modal');
}

// Update the balance in localStorage whenever it changes
function handleDeposit() {
    const amount = parseInt(document.getElementById('deposit-amount').value);
    if (!isNaN(amount) && amount >= MIN_DEPOSIT) {
        balance += amount;
        updateBalanceDisplay();
        localStorage.setItem('balance', balance); // Store the updated balance in localStorage
        closeModal('deposit-modal');
        document.getElementById('deposit-amount').value = '';
        displayMessage(`Successfully deposited ${amount} TON!`, true);
    } else {
        displayMessage(`Please enter a valid amount. Minimum deposit is ${MIN_DEPOSIT} TON.`, false);
    }
}

function handleWithdrawal() {
    const amount = parseInt(document.getElementById('withdraw-amount').value);
    if (!isNaN(amount) && amount >= MIN_WITHDRAWAL) {
        if (amount <= balance) {
            balance -= amount;
            updateBalanceDisplay(); // Update the display in the main app
            
            // Store the updated balance in localStorage
            localStorage.setItem('balance', balance);
            
            closeModal('withdraw-modal');
            document.getElementById('withdraw-amount').value = '';
            displayMessage(`Withdrawal of ${amount} TON processed to your wallet.`, true);
        } else {
            displayMessage(`Insufficient balance. Your current balance is ${Math.floor(balance)} TON.`, false);
        }
    } else {
        displayMessage(`Please enter a valid amount. Minimum withdrawal is ${MIN_WITHDRAWAL} TON.`, false);
    }
}


// Open modals
document.getElementById('connect-wallet').addEventListener('click', () => openModal('wallet-modal'));
document.getElementById('deposit-button').addEventListener('click', openDepositModal);
document.getElementById('withdraw-button').addEventListener('click', () => openModal('withdraw-modal'));

// Close modals
document.querySelector('.close').addEventListener('click', () => closeModal('wallet-modal'));
document.querySelector('.close-deposit').addEventListener('click', () => closeModal('deposit-modal'));
document.querySelector('.close-withdraw').addEventListener('click', () => closeModal('withdraw-modal'));

// Close modals when clicking outside
window.addEventListener('click', function (event) {
    ['wallet-modal', 'deposit-modal', 'withdraw-modal'].forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            closeModal(modalId);
        }
    });
});

// Connect wallet via Telegram
document.getElementById('connect-telegram').addEventListener('click', function () {
    isWalletConnected = true;
    updateWalletButton();
    closeModal('wallet-modal');
    displayMessage('Wallet connected successfully via Telegram!', true);
});

// Connect wallet via Tonkeeper
document.getElementById('Tonkeeper').addEventListener('click', function () {
    isWalletConnected = true;
    updateWalletButton();
    closeModal('wallet-modal');
    displayMessage('Wallet connected successfully via Tonkeeper!', true);
});


// Confirm deposit
document.getElementById('confirm-deposit').addEventListener('click', handleDeposit);

// Confirm withdrawal
document.getElementById('confirm-withdraw').addEventListener('click', function () {
    const amount = parseInt(document.getElementById('withdraw-amount').value);
    
    if (!isNaN(amount) && amount >= MIN_WITHDRAWAL) {
        if (amount <= balance) {
            balance -= amount;
            updateBalanceDisplay(); // Update the display in the current app
            
            // Save the updated balance in localStorage to ensure it's shared with other apps
            localStorage.setItem('balance', balance);

            closeModal('withdraw-modal');
            document.getElementById('withdraw-amount').value = '';
            displayMessage(`Withdrawal of ${amount} TON processed to your wallet.`, true);
        } else {
            displayMessage(`Insufficient balance. Your current balance is ${Math.floor(balance)} TON.`, false);
        }
    } else {
        displayMessage(`Please enter a valid amount. Minimum withdrawal is ${MIN_WITHDRAWAL} TON.`, false);
    }
});

// Initialize displays
updateBalanceDisplay();
updateWalletButton();

// Additional deposit buttons
document.getElementById('deposit-button-game').addEventListener('click', openDepositModal);
document.querySelectorAll('.deposit-button').forEach(button => {
    button.addEventListener('click', openDepositModal);
});

// Initialize displays
updateBalanceDisplay();
updateWalletButton();

//Deposit-Game-Section Redirection
document.addEventListener('DOMContentLoaded', function () {
    const depositButton = document.getElementById('deposit-funds-button');
    const profileSection = document.getElementById('profile-section');

    depositButton.addEventListener('click', function () {
        if (profileSection.style.display === 'none' || profileSection.style.display === '') {
            profileSection.style.display = 'block';
        } else {
            profileSection.style.display = 'none';
        }
    });
});
