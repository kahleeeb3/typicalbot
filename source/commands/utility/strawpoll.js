const Command = require("../../structures/Command");
const request = require("superagent");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Create a strawpoll vote. Use the '-m' flag for multiple choice.",
            usage: "strawpoll ['-m'] <question> | Choice1; Choice2; Choice+"
        });
    }

    execute(message, permissionLevel) {
        const args = /strawpoll(?:\s+(-m))?\s+(.+)\s+\|\s+(.+)/i.exec(message.content);
        if (!args) return message.error(this.client.functions.error("usage", this));

        const multi = !!args[1];
        const question = args[2];
        const answers = args[3];

        const list = answers.split(/\s*;\s*/i);
        if (list.length < 2 || list.length > 30) return message.error("There must be between 2 and 30 choices for the strawpoll to be created.");

        request.post("https://www.strawpoll.me/api/v2/polls")
            .send({ "title": question, "options": list, "multi": multi })
            .end((err, res) => {
                if (err || res.statusCode !== 200) return message.error(`An error occured making that request.`);

                message.reply(`Your strawpoll has been created! <https://strawpoll.me/${res.body.id}>`);
            });
    }
};