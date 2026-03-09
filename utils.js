const config = require('./config');

function getLatency(startTime) {
    return Date.now() - startTime;
}

function getUserNumber(message) {
    return message.key.participant || message.key.remoteJid;
}

function getPlatform() {
    return 'WhatsApp';
}

function formatJid(jid) {
    return jid.split('@')[0];
}

// Nouvelle fonction pour envoyer un message avec la fausse citation
function sendWithFakeQuote(sock, jid, text) {
    return sock.sendMessage(jid, { text }, { quoted: config.fakeQuoted });
}

module.exports = {
    getLatency,
    getUserNumber,
    getPlatform,
    formatJid,
    sendWithFakeQuote
};
