const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs');

async function test() {
    const phone = '50941131299'; // remplace par ton numéro
    const sessionDir = './test-session';
    if (fs.existsSync(sessionDir)) fs.rmSync(sessionDir, { recursive: true, force: true });

    const { state } = await useMultiFileAuthState(sessionDir);
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        browser: ['EXIT-MD', 'Safari', '3.0']
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        console.log('Connection update:', connection, lastDisconnect?.error?.message);
        if (connection === 'open') {
            console.log('Connexion établie, demande du code...');
            try {
                const code = await sock.requestPairingCode(phone);
                console.log('✅ Code reçu :', code);
                process.exit(0);
            } catch (err) {
                console.error('❌ Erreur demande code :', err);
                process.exit(1);
            }
        }
        if (connection === 'close') {
            console.error('❌ Connexion fermée avant ouverture');
            process.exit(1);
        }
    });
}

test();
