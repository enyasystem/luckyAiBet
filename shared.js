// shared.js
let balance = 100; // Initial balance

function updateBalanceDisplay() {
    const balanceElements = document.querySelectorAll('.balance-display');
    balanceElements.forEach(element => {
        element.textContent = Math.floor(balance); // Display balance as a whole number
    });
}

function setBalance(newBalance) {
    balance = newBalance;
    updateBalanceDisplay();
}

function getBalance() {
    return balance;
}

// Initialize the display on load
document.addEventListener('DOMContentLoaded', () => {
    updateBalanceDisplay();
});
