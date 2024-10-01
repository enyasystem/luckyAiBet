const horses = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    element: document.getElementById(`horse${i + 1}`),
    position: 0
}));

const bettingHistory = document.getElementById("bettingHistoryList");
const raceSpeedSelect = document.getElementById('raceSpeed');
let raceSpeedMultiplier = 1;

const MIN_BET_AMOUNT = 10; // Minimum bet amount in TON

let betAmount = parseInt(document.getElementById('betAmount').value);
let selectedHorse = 1;
let raceOngoing = false;
let timerInterval;
let setWinner = null;

document.getElementById('horseSelect').addEventListener('change', (e) => {
    selectedHorse = parseInt(e.target.value);
});

document.getElementById('betAmount').addEventListener('change', (e) => {
    betAmount = parseInt(e.target.value);
    if (betAmount < MIN_BET_AMOUNT) {
        showMessage(`Minimum bet amount is ${MIN_BET_AMOUNT} TON`, 'red');
        e.target.value = MIN_BET_AMOUNT;
        betAmount = MIN_BET_AMOUNT;
    }
});

document.getElementById('startRaceBtn').addEventListener('click', startRace);
document.getElementById('setWinnerBtn').addEventListener('click', setRaceWinner);
raceSpeedSelect.addEventListener('change', updateRaceSpeed);

function updateRaceSpeed() {
    raceSpeedMultiplier = raceSpeedSelect.value === 'fast' ? 2 : 1;
}

function getBalance() {
    // Retrieve the balance from localStorage or fallback to 0 if not set
    return parseInt(localStorage.getItem('balance')) || 0;
}

function setBalance(newBalance) {
    // Update both the balance in the DOM and localStorage
    document.getElementById('balanceDisplay').textContent = newBalance;
    localStorage.setItem('balance', newBalance);
}

// Initialize balance display
setBalance(getBalance());

function startRace() {
    if (raceOngoing) {
        showMessage("Race already ongoing!", 'red');
        return;
    }

    if (betAmount < MIN_BET_AMOUNT) {
        showMessage(`Minimum bet amount is ${MIN_BET_AMOUNT} TON`, 'red');
        return;
    }

    if (getBalance() < betAmount) {
        showMessage("Insufficient balance!", 'red');
        return;
    }

    raceOngoing = true;
    resetRace();

    setBalance(getBalance() - betAmount);
    showMessage(`Bet placed: ${betAmount} TON on Horse ${selectedHorse}`, 'green');

    startTimer();

    horses.forEach(horse => {
        horse.element.classList.add('galloping');
        horse.element.style.opacity = 1;
    });

    const raceDuration = 5400;
    const startTime = Date.now();
    const raceInterval = setInterval(() => {
        if (Date.now() - startTime >= raceDuration) {
            clearInterval(raceInterval);
            endRace();
        } else {
            moveHorses();
        }
    }, 100);
}

function resetRace() {
    horses.forEach(horse => {
        horse.position = 0;
        horse.element.style.left = '0px';
        horse.element.classList.remove('galloping');
        horse.element.style.opacity = 0;
    });
}

function moveHorses() {
    horses.forEach(horse => {
        if (setWinner && setWinner === horse.id) {
            horse.position += Math.random() * 15 * raceSpeedMultiplier;
        } else {
            horse.position += Math.random() * 10 * raceSpeedMultiplier;
        }

        horse.element.style.left = `${horse.position}px`;

        if (horse.position >= document.querySelector('.track').clientWidth - 80) {
            horse.position = document.querySelector('.track').clientWidth - 80;
        }
    });
}

function endRace() {
    raceOngoing = false;
    stopTimer();

    const winner = setWinner || horses.reduce((prev, curr) => prev.position > curr.position ? prev : curr).id;
    displayResults(winner);

    const outcome = winner === selectedHorse ? 'win' : 'loss';
    updateBettingHistory(outcome, winner);

    if (outcome === 'win') {
        const winnings = betAmount * 2;
        setBalance(getBalance() + winnings);
        showMessage(`Congratulations! You won ${winnings} TON`, 'green');
    } else {
        showMessage(`Sorry, you lost ${betAmount} TON`, 'red');
    }

    setWinner = null;

    resetHorses();
}

function resetHorses() {
    setTimeout(() => {
        horses.forEach(horse => {
            horse.position = 0;
            horse.element.style.left = '0px';
            horse.element.classList.remove('galloping');
            horse.element.style.opacity = 0;
        });
    }, 1000);
}

function setRaceWinner() {
    setWinner = parseInt(document.getElementById('selectWinner').value);
    showMessage(`Admin has set Horse ${setWinner} as the potential winner!`, 'green');
}

function startTimer() {
    let startTime = Date.now();
    timerInterval = setInterval(() => {
        let elapsedTime = Date.now() - startTime;
        document.getElementById('timer').innerText = (elapsedTime / 1000).toFixed(3);
    }, 100);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function displayResults(winner) {
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = `<li>Horse ${winner} is the winner!</li>`;
}

function updateBettingHistory(outcome, winner) {
    const winnings = outcome === 'win' ? betAmount * 2 : 0;
    const betHistoryEntry = document.createElement('li');
    betHistoryEntry.classList.add(outcome === 'win' ? 'win' : 'loss');
    betHistoryEntry.innerHTML = `
        <i class="fas fa-${outcome === 'win' ? 'check-circle' : 'times-circle'}"></i>
        You bet on Horse ${selectedHorse}, Horse ${winner} won! 
        <span class="bet-info">Bet Amount: ${betAmount} TON | Total Winnings: ${winnings} TON</span>
    `;
    bettingHistory.prepend(betHistoryEntry);
}

function showMessage(message, color) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.style.color = color;
    messageElement.style.display = 'block';
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 3000);
}

setTimeout(function() {
    document.getElementById('loader').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
    // Initialize balance display when the page loads
    setBalance(getBalance());
}, 1000);
