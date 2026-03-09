const fs = require('fs');
const path = require('path');

let config;
try {
    const configPath = path.join(__dirname, 'config.json');
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
} catch (e) {
    console.error('Erreur de lecture de config.json :', e);
    config = {
        ownerName: '©Mr Marco',
        ownerNumber: '50941131299',
        botName: 'EXIT-MD',
        prefix: '.',
        mode: 'public',
        timezone: 'UTC'
    };
}

module.exports = config;
