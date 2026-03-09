const config = require('../config');
const utils = require('../utils');

module.exports = {
    name: 'fun',
    async execute(sock, message, args) {
        const start = Date.now();
        const userNumber = utils.formatJid(utils.getUserNumber(message));
        const latency = utils.getLatency(start);
        const platform = utils.getPlatform();

        const menu = `> ╔════[ ${config.botName} ]════╗
> ┃➥ 𝔬𝔴𝔫𝔢𝔯 : ${config.ownerName}
> ┃➥ 𝔩𝔞𝔱𝔢𝔫𝔠𝔢 : ${latency}ms
> ┃➥ 𝔭𝔯𝔢𝔣𝔦𝔵 : ${config.prefix.join(' ou ')}
> ┃➥ 𝔪𝔬𝔡𝔢 : ${config.mode || 'public'}
> ┃➥ 𝔲𝔰𝔢𝔯 : ${userNumber}
> ┃➥ 𝔭𝔩𝔞𝔱𝔣𝔬𝔯𝔪 : ${platform}
> ╚════════════════╝
> ╔═════ ❬ 𝔣𝔲𝔫 𝔪𝔢𝔫𝔲 ❭ ════╗
> ┃➥ 𝔧𝔬𝔨𝔢
> ┃➥ 𝔮𝔲𝔦𝔷𝔷
> ┃➥ 𝔱𝔬𝔱𝔬
> ┃➥ 𝔥𝔞𝔭𝔭𝔶
> ┃➥ 𝔯𝔦𝔦𝔦𝔦𝔦𝔦
> ┃➥ 𝔣𝔲𝔫𝔫𝔶
> ╚════════════════╝
${config.footer}`;

        // Utilisation de la nouvelle fonction pour la réponse
        await utils.sendWithFakeQuote(sock, message.key.remoteJid, menu);
    }
};
