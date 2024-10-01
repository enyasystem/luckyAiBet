const http = require('http');

const horses = [
    { name: "Horse 1", image: "🐎" },
    { name: "Horse 2", image: "🐴" },
    { name: "Horse 3", image: "🦄" },
    { name: "Horse 4", image: "🐲" }
];

const winningChances = {
    "Horse 1": 99,
    "Horse 2": 30,
    "Horse 3": 20,
    "Horse 4": 2
};

const raceFrames = [
    '🏁 🐎 🐴 🦄 🐲',
    '🏁 🐴 🦄 🐲 🐎',
    '🏁 🦄 🐲 🐎 🐴',
    '🏁 🐲 🐎 🐴 🦄',
    '🏁 🐎 🐴 🦄 🐲'
];

function simulateRace() {
    const raceResults = {};

    horses.forEach(horse => {
        const winningChance = winningChances[horse.name];
        raceResults[horse.name] = Math.random() * 100 < winningChance;
    });

    console.log("Virtual Horse Race Results:");
    horses.forEach(horse => {
        console.log(`${horse.image} ${horse.name}: ${raceResults[horse.name] ? "Winner" : "Lost"}`);
    });

    let winners = horses.filter(horse => raceResults[horse.name]);
    let winner = winners.length > 0 ? winners[0] : horses[Math.floor(Math.random() * horses.length)];
    
    console.log(`The winner is: ${winner.image} ${winner.name}`);
}

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    let currentFrame = 0;
    const raceInterval = setInterval(() => {
        res.write(`<pre>${raceFrames[currentFrame]}</pre>`);
        currentFrame++;

        if (currentFrame === raceFrames.length) {
            clearInterval(raceInterval);
            simulateRace();
        }
    }, 1000);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
