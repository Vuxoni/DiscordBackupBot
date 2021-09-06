const Discord = require("discord.js"),
backup = require("discord-backup"),
client = new Discord.Client(),
settings = {
    prefix: ".",
    token: "PUT_YOUR_TOKEN_HERE"
};
const actvs = [
    "Veilon™ | v1.0",
    "Veilon™ | Backup",
];

client.on("ready", () => {
    console.log("Veilon™ Backup is ready! \nWARNING: Bot is currently in beta. \nBACKUP: Loaded.");
    client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)]);
    setInterval(() => {
        client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)]);
    }, 10000);
});

client.on("message", async message => {


    if (!message.content.startsWith(settings.prefix) || message.author.bot) return;

	const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
    let role = message.member.guild.roles.cache.find(role => role.name === "» 👑 ・ Owner・");
    if(command === "create"){
        if(!message.member.roles.cache.some(role => role.name === '» 👑 ・ Owner・') ){ 
            console.log('ERROR:', message.author.tag, 'tried to create backup! No permissions!');
            return message.channel.send(":x: | You can't do this!");
        }
        backup.create(message.guild, {
            jsonBeautify: true
        }).then((backupData) => {
            console.log('BACKUP:', message.author.tag, 'created backup. Backup ID:', backupData.id);
            message.author.send(
                new Discord.MessageEmbed()
                 .setTitle('```» Backup```')
                 .setColor("#0060ff")
                 .setDescription(`Backup created. \nIf you want to load it, use: **.load ID** ! \n Backup ID: ${backupData.id}`)
                 .setTimestamp()
            )

            message.channel.send(
                new Discord.MessageEmbed()
                .setTitle('```» Backup```')
                .setColor("#0060ff")
                .setDescription(`Backup created. Check your DM.`)
                .setTimestamp()
            )
            message.client.channels.cache.get("LOG_CHANNEL_ID").send(
                new Discord.MessageEmbed()
                    .setTitle('```» Backup```')
                    .setColor("0060ff")
                    .setDescription(`${message.author.tag} created backup. \nYou can check backup ID in console.`)
                    .setTimestamp()
            )
        });
    }

    if(command === "load"){
        if(!message.member.roles.cache.some(role => role.name === '» 👑 ・ Owner・') ){ 
            console.log('ERROR:', message.author.tag, 'tried to load backup! No permissions!');
            return message.channel.send(":x: | You can't do this!");
        }
        let backupID = args[0];
        if(!backupID){
            console.log('ERROR:', message.author.tag, 'tried to load backup. Wrong ID!');
            return message.channel.send(":x: | Wrong ID!");
        }
            backup.fetch(backupID).then(async () => {
                message.channel.send(":warning: | Use *.ok ID* to confirm this action! This can't be undone!");
                   
                    });
                }
                    if(command ==="ok"){
                        if(!message.member.hasPermission("ADMINISTRATOR")){
                            console.log('ERROR:', message.author.tag, 'tried to load backup! No permissions!');
                            return message.channel.send(":x: | You can't do this!");
                        }
                        let backupID = args[0];
                        if(!backupID){
                            console.log('ERROR:', message.author.tag, 'tried to load backup! Wrong ID!');
                            return message.channel.send(":x: | Wrong ID!");
                        }
                        backup.fetch(backupID).then(async () => {
                        message.author.send(":white_check_mark:  | Loading started!");
                        backup.load(backupID, message.guild).then(() => {
                            message.author.send(":white_check_mark:  | Backup load succesfull.")
                        
                        }).catch((err) => {
                            return message.author.send(":x: | Error happened during load!");
                        });
                }).catch((err) => {
                    console.log(err);
                    return message.channel.send(":x: | There is no backup with ID: `"+backupID+"`!");
                });
        }

    if(command === "infos"){
        let backupID = args[0];
        if(!backupID){
            return message.channel.send(":x: | Wrong ID!");
        }

        backup.fetch(backupID).then((backupInfos) => {
            const date = new Date(backupInfos.data.createdTimestamp);
            const yyyy = date.getFullYear().toString(), mm = (date.getMonth()+1).toString(), dd = date.getDate().toString();
            const formatedDate = `${yyyy}/${(mm[1]?mm:"0"+mm[0])}/${(dd[1]?dd:"0"+dd[0])}`;
            let embed = new Discord.MessageEmbed()
                .setTitle('```» Backup Info```')
                .addField("Backup ID:", backupInfos.id, false)
                .addField("Server ID:", backupInfos.data.guildID, false)
                .addField("Size:", `${backupInfos.size} kb`, false)
                .addField("Created:", formatedDate, false)
                .setColor("#0060ff");
            message.channel.send(embed);
        }).catch((err) => {
            return message.channel.send(":x: | There is no backup with ID `"+backupID+"`!");
        });
    }

});


client.login(settings.token);