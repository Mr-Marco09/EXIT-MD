const config = require('../config');
const utils = require('../utils');

module.exports = {
    name: 'help',
    async execute(sock, message, args) {
        const start = Date.now();
        const userNumber = utils.formatJid(utils.getUserNumber(message));
        const latency = utils.getLatency(start);
        const platform = utils.getPlatform();

        const helpText = `> ╔════[ ${config.botName} ]════╗
> ┃➥ 𝔬𝔴𝔫𝔢𝔯 : ${config.ownerName}
> ┃➥ 𝔩𝔞𝔱𝔢𝔫𝔠𝔢 : ${latency}ms
> ┃➥ 𝔭𝔯𝔢𝔣𝔦𝔵 : ${config.prefix}
> ┃➥ 𝔪𝔬𝔡𝔢 : ${config.mode}
> ┃➥ 𝔲𝔰𝔢𝔯 : ${userNumber}
> ┃➥ 𝔭𝔩𝔞𝔱𝔣𝔬𝔯𝔪 : ${platform}
> ╚════════════════╝
> ╔══════ ❬ 𝔥𝔢𝔩𝔭 ❭ ══════╗
> ┃➥ ┃𝔲𝔱𝔦𝔩𝔦𝔰𝔢 𝔭𝔯𝔢𝔣𝔦𝔵 + 𝔠𝔬𝔪𝔪𝔞𝔫𝔡
> ┃➥ ┃𝔫𝔢 𝔪𝔢𝔱 𝔧𝔞𝔪𝔞𝔦𝔰 𝔲𝔫𝔢 𝔩𝔢𝔱𝔱𝔯𝔢 𝔪𝔞𝔧𝔲𝔰𝔠𝔲𝔩
> ┃➥ ┃𝔱𝔬𝔲𝔱 𝔩𝔢𝔰 𝔭𝔯𝔢𝔣𝔦𝔵 𝔰𝔬𝔫𝔱 𝔭𝔩𝔞𝔠é𝔢 𝔞𝔳𝔞𝔫𝔱 𝔩𝔢𝔰 𝔠𝔬𝔪𝔪𝔞𝔫𝔡𝔰
> ┃➥ ┃𝔲𝔱𝔦𝔩𝔦𝔰𝔢 𝔩𝔢 𝔟𝔬𝔱 𝔲𝔫𝔦𝔮𝔲𝔢𝔪𝔢𝔫𝔱 𝔞 𝔡𝔢𝔰 𝔣𝔦𝔫 𝔢𝔱𝔥𝔦𝔮𝔲𝔢
> ┃➥ ┃𝔫'𝔞𝔟𝔲𝔰𝔢 𝔭𝔞𝔰 𝔰𝔬𝔲𝔰 𝔯𝔦𝔰𝔮𝔲𝔢 𝔡'ê𝔱𝔯𝔢 𝔟𝔞𝔫𝔦
> ┃➥ ┃𝔫𝔢 𝔧𝔞𝔪𝔞𝔦𝔰 𝔲𝔱𝔦𝔩𝔦𝔰𝔢𝔯 𝔩𝔢𝔰 𝔟𝔲𝔤 𝔭𝔬𝔲𝔯 𝔞𝔰𝔰𝔬𝔲𝔳𝔦𝔯 𝔳𝔬𝔱𝔯𝔢 𝔡𝔢𝔰𝔦𝔯
> ┃➥ ┃𝔯𝔢𝔧𝔬𝔦𝔫 𝔩𝔢 𝔠𝔥𝔞𝔫𝔢𝔩 𝔢𝔱 𝔡𝔬𝔫𝔫𝔢 𝔳𝔬𝔱𝔯𝔢 𝔰𝔲𝔭𝔭𝔬𝔯𝔱 𝔞 𝔩'𝔬𝔴𝔫𝔢𝔯
> ┃➥ ┃𝔠𝔬𝔫𝔱𝔞𝔠𝔱𝔢𝔯 𝔩'𝔬𝔴𝔫𝔢𝔯 𝔳𝔦𝔞 𝔴𝔞𝔱𝔰𝔞𝔭𝔭 𝔬𝔲 𝔤𝔪𝔞𝔦𝔩
> ┃➥ ┃https://wa.me/${config.ownerNumber}
> ┃➥ ┃mompremiermarco09@gmail.com
> ╚════════════════╝
> 𝔓𝔬𝔴𝔢𝔯𝔢𝔡 𝔟𝔶 ${config.ownerName}𓅓`;

        await sock.sendMessage(message.key.remoteJid, { text: helpText });
    }
};
