const { getContentType } = require("@whiskeysockets/baileys");
const config = require("./config.json");

const LOGO = config.logoUrl || config.botLogo;

const handleEvents = (conn, saveCreds, commands) => {
    
    conn.ev.on('creds.update', saveCreds);

    conn.reply = conn.reply || {};

    conn.ev.on('messages.upsert', async (mek) => {
        const m = mek.messages[0];
        if (!m || !m.message) return;

        const from = m.key.remoteJid;
        const type = getContentType(m.message);
        const body = (type === 'conversation') ? m.message.conversation : 
                     (type === 'extendedTextMessage') ? m.message.extendedTextMessage.text : 
                     (type === 'imageMessage') ? m.message.imageMessage.caption : '';

        // --- RÉPONSES CONTEXTUELLES ---
        const quotedMsgId = m.message?.extendedTextMessage?.contextInfo?.stanzaId;
        if (quotedMsgId && conn.reply[quotedMsgId]) {
            const { downloadUrl, title } = conn.reply[quotedMsgId];
            if (["1", "2", "3"].includes(body)) {
                await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });
                if (body === "1") {
                    await conn.sendMessage(from, { audio: { url: downloadUrl }, mimetype: "audio/mpeg" }, { quoted: m });
                } else if (body === "2") {
                    await conn.sendMessage(from, { document: { url: downloadUrl }, mimetype: "audio/mpeg", fileName: `${title}.mp3` }, { quoted: m });
                } else if (body === "3") {
                    await conn.sendMessage(from, { audio: { url: downloadUrl }, mimetype: "audio/mpeg", ptt: true }, { quoted: m });
                }
                await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
                return;
            }
        }

        // --- STATUTS ---
        if (from === 'status@broadcast') {
            if (config.AUTO_READ_STATUS === "true") await conn.readMessages([m.key]);
            return;
        }

        // --- COMMANDES AVEC PRÉFIXES MULTIPLES ---
        let usedPrefix = null;
        for (const p of config.prefix) {
            if (body.startsWith(p)) {
                usedPrefix = p;
                break;
            }
        }
        if (!usedPrefix) return;

        const args = body.slice(usedPrefix.length).trim().split(/ +/);
        const cmdName = args.shift().toLowerCase();
        const command = commands.get(cmdName);

        if (command) {
            if (config.privateMode === true && from !== config.ownerNumber + "@s.whatsapp.net") return;
            try {
                await command.execute(conn, m, args);
            } catch (e) {
                console.error(`Erreur dans la commande ${cmdName}:`, e);
                await conn.sendMessage(from, { text: '❌ Erreur lors de l\'exécution.' });
            }
        } else {
            await conn.sendMessage(from, { text: '❌ Commande inconnue.' });
        }
    });

    // --- WELCOME EN GROUPE ---
    conn.ev.on('group-participants.update', async (anu) => {
        const participant = anu.participants[0];
        const jid = participant.split('@')[0];
        try {
            if (anu.action === 'add') {
                await conn.sendMessage(anu.id, { 
                    image: { url: LOGO }, 
                    caption: `Bienvenue @${jid} dans la team ${config.botName} ! 🛡️`, 
                    mentions: [participant] 
                });
            }
        } catch (e) { console.error("Erreur Welcome:", e); }
    });

    // --- MESSAGE DE CONNEXION AU PROPRIÉTAIRE ---
    conn.ev.on('connection.update', async ({ connection }) => {
        if (connection === 'open') {
            const msg = `🚀 *${config.botName}* en ligne !\n\nPrefix: ${config.prefix.join(' ou ')}\nProprio: ${config.ownerName}`;
            await conn.sendMessage(config.ownerNumber + "@s.whatsapp.net", { image: { url: LOGO }, caption: msg });
        }
    });
};

module.exports = { handleEvents };
