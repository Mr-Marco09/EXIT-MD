const express = require("express");
const path = require("path");
const config = require("./config.json");

const app = express();
const PORT = process.env.PORT || 3000;

let createSession;

const startServer = (createSessionFn) => {
    createSession = createSessionFn;

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/config', (req, res) => {
        res.json({
            logo: config.logoUrl || '',
            channelImage: config.channelImage || '',
            ownerNumber: config.ownerNumber || '',
            channelLink: config.channelLink || ''
        });
    });

    app.post('/generate-pairing', async (req, res) => {
        const { number } = req.body;
        if (!number) return res.status(400).json({ error: 'Numéro requis' });
        if (!/^509\d{8}$/.test(number)) {
            return res.status(400).json({ error: 'Format invalide. Utilisez 509xxxxxxxxx' });
        }

        try {
            const sock = await createSession(number);
            const code = await sock.requestPairingCode(number);
            res.json({ pairingCode: code });
        } catch (err) {
            console.error('Erreur génération code:', err);
            res.status(500).json({ error: err.message });
        }
    });

    app.get('/pair', async (req, res) => {
        const number = req.query.number;
        if (!number) return res.status(400).json({ error: 'Numéro requis' });
        try {
            const sock = await createSession(number);
            const code = await sock.requestPairingCode(number);
            res.json({ success: true, code });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🌍 Serveur de ${config.botName} en ligne sur le port ${PORT}`);
    });
};

module.exports = { startServer };
