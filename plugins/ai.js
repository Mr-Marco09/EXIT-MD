const config = require('../config');
const utils = require('../utils');

module.exports = {
    name: 'ai',
    async execute(sock, message, args) {
        const start = Date.now();
        const userNumber = utils.formatJid(utils.getUserNumber(message));
        const latency = utils.getLatency(start);
        const platform = utils.getPlatform();

        const aiMenu = `> ╔════[ ${config.botName} ]════╗
> ┃➥ 𝔬𝔴𝔫𝔢𝔯 : ${config.ownerName}
> ┃➥ 𝔩𝔞𝔱𝔢𝔫𝔠𝔢 : ${latency}ms
> ┃➥ 𝔭𝔯𝔢𝔣𝔦𝔵 : ${config.prefix}
> ┃➥ 𝔪𝔬𝔡𝔢 : ${config.mode}
> ┃➥ 𝔲𝔰𝔢𝔯 : ${userNumber}
> ┃➥ 𝔭𝔩𝔞𝔱𝔣𝔬𝔯𝔪 : ${platform}
> ╚════════════════╝
> ╔═════ ❬ 𝔞𝔦 𝔪𝔢𝔫𝔲 ❭ ═════╗
> ┃➥ 𝔤𝔭𝔱
> ┃➥ 𝔤𝔢𝔪𝔦𝔫𝔦
> ┃➥ 𝔣𝔞𝔫𝔠𝔶
> ┃➥ 𝔭𝔥𝔬𝔱𝔬
> ┃➥ 𝔭𝔯𝔬𝔪𝔭𝔱𝔢
> ┃➥ 𝔰𝔢𝔞𝔯𝔠𝔥
> ╚════════════════╝
> 𝔓𝔬𝔴𝔢𝔯𝔢𝔡 𝔟𝔶 ${config.ownerName}𓅓`;

        await sock.sendMessage(message.key.remoteJid, { text: aiMenu });
    }
};
