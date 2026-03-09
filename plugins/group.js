const config = require('../config');
const utils = require('../utils');

module.exports = {
    name: 'group',
    async execute(sock, message, args) {
        const start = Date.now();
        const userNumber = utils.formatJid(utils.getUserNumber(message));
        const latency = utils.getLatency(start);
        const platform = utils.getPlatform();

        // Récupérer des infos sur le groupe si le message est dans un groupe
        let groupName = "N/A";
        let totalMembers = "N/A";
        let admins = "N/A";
        if (message.key.remoteJid.endsWith('@g.us')) {
            try {
                const metadata = await sock.groupMetadata(message.key.remoteJid);
                groupName = metadata.subject;
                totalMembers = metadata.participants.length;
                admins = metadata.participants.filter(p => p.admin).map(p => utils.formatJid(p.id)).join(', ');
            } catch (e) {
                console.error('Erreur récupération groupe:', e);
            }
        }

        const groupMenu = `> ╔════[ ${config.botName} ]════╗
> ┃➥ 𝔤𝔯𝔬𝔲𝔭: ${groupName}
> ┃➥ 𝔱𝔬𝔱𝔞𝔩: ${totalMembers}
> ┃➥ 𝔞𝔡𝔪𝔦𝔫: ${admins}
> ╚════════════════╝
> ╔═════ ❬ 𝔱𝔞𝔤 𝔞𝔩𝔩 ❭ ══════╗
> ┃➥ @${config.ownerNumber}
> ┃➥ @~${config.ownerName.replace(/\s/g, '')}
> ┃➥ @~${config.ownerName}
> ╚════════════════╝
> 𝔓𝔬𝔴𝔢𝔯𝔢𝔡 𝔟𝔶 ${config.ownerName}𓅓`;

        await sock.sendMessage(message.key.remoteJid, { text: groupMenu });
    }
};
