const { 
    default: makeWASocket, useMultiFileAuthState, DisconnectReason, 
    fetchLatestWaWebVersion, Browsers, makeCacheableSignalKeyStore 
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs-extra");
const path = require("path");
const { Boom } = require("@hapi/boom");
const config = require("./config.json");
const { startServer } = require("./server");
const { handleEvents } = require("./events");

const commands = new Map();
let serverStarted = false;

// --- CHARGEMENT DES PLUGINS ---
const loadPlugins = () => {
    const pluginPath = path.join(__dirname, "plugins");
    if (!fs.existsSync(pluginPath)) fs.mkdirSync(pluginPath);

    fs.readdirSync(pluginPath).forEach((file) => {
        if (file.endsWith(".js")) {
            try {
                const plugin = require(`./plugins/${file}`);
                if (plugin.name) {
                    commands.set(plugin.name, plugin);
                }
            } catch (e) {
                console.error(`❌ Erreur plugin ${file}:`, e.message);
            }
        }
    });
    console.log(`📦 [${config.botName}] : ${commands.size} Plugins opérationnels`);
};

// --- MAP DES SESSIONS ACTIVES ---
const sessions = new Map();

// --- CRÉATION D'UNE SESSION POUR UN NUMÉRO ---
async function createSession(phoneNumber) {
    // Si la session existe déjà et est connectée, on la retourne
    if (sessions.has(phoneNumber)) {
        const sock = sessions.get(phoneNumber);
        if (sock.ws?.readyState === 1) {
            console.log(`🔄 Session déjà connectée pour ${phoneNumber}`);
            return sock;
        } else {
            console.log(`🔄 Session existante mais déconnectée pour ${phoneNumber}, reconnexion...`);
            sessions.delete(phoneNumber);
        }
    }

    const sessionPath = path.join(__dirname, 'sessions', phoneNumber);
    await fs.ensureDir(sessionPath);

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestWaWebVersion().catch(() => ({ version: [2, 3000, 1015901307] }));

    const sock = makeWASocket({
        version,
        logger: pino({ level: "fatal" }),
        printQRInTerminal: false,
        browser: Browsers.ubuntu("Chrome"),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        }
    });

    // Attacher les événements communs (messages, etc.)
    handleEvents(sock, saveCreds, commands);

    // Attendre que la connexion soit réellement ouverte avant de retourner
    await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error(`Timeout connexion pour ${phoneNumber}`)), 60000);
        const handler = (update) => {
            if (update.connection === 'open') {
                clearTimeout(timeout);
                sock.ev.off('connection.update', handler);
                resolve();
            }
        };
        sock.ev.on('connection.update', handler);
    });

    console.log(`✅ [${phoneNumber}] Connecté !`);

    // Gestion de la reconnexion et de la fermeture
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            const shouldReconnect = reason !== DisconnectReason.loggedOut;
            console.log(`⚠️ [${phoneNumber}] Déconnecté (raison: ${reason}). Reconnexion : ${shouldReconnect}`);
            if (shouldReconnect) {
                sessions.delete(phoneNumber);
                setTimeout(() => createSession(phoneNumber), 5000);
            } else {
                fs.remove(sessionPath);
                sessions.delete(phoneNumber);
            }
        }
    });

    sessions.set(phoneNumber, sock);
    return sock;
}

// --- RESTAURER LES SESSIONS EXISTANTES AU DÉMARRAGE ---
async function restoreSessions() {
    const sessionsDir = path.join(__dirname, 'sessions');
    if (!fs.existsSync(sessionsDir)) return;
    const folders = await fs.readdir(sessionsDir);
    for (const folder of folders) {
        const fullPath = path.join(sessionsDir, folder);
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) {
            createSession(folder).catch(err => {
                console.error(`❌ Erreur reconnexion ${folder}:`, err.message);
            });
        }
    }
}

// --- POINT D'ENTRÉE PRINCIPAL ---
async function main() {
    loadPlugins();
    await restoreSessions();

    if (!serverStarted) {
        startServer(createSession);
        serverStarted = true;
    }
}

main().catch(err => {
    console.error("Erreur critique :", err);
});
