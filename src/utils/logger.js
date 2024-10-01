// src/utils/logger.js
// Simple logger using console
const logger = {
    info: (message) => {
        console.log(`INFO: ${message}`);
    },
    error: (message) => {
        console.error(`ERROR: ${message}`);
    },
};

module.exports = logger;
