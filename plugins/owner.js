const config = require('../config');

module.exports = {
    name: 'owner',
    async execute(sock, message, args) {
        const vcard = 'BEGIN:VCARD\n' +
            'VERSION:3.0\n' +
            `FN:${config.ownerName}\n` +
            `TEL;type=CELL;type=VOICE;waid=${config.ownerNumber}:+${config.ownerNumber}\n` +
            'END:VCARD';

        await sock.sendMessage(message.key.remoteJid, {
            contacts: {
                displayName: config.ownerName,
                contacts: [{ vcard }]
            }
        });
    }
};
