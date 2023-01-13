const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] }); 

const prefix = '>';

client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");






(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)

    client.on("ready", () =>{
        console.log("Setting up custom status!");
    
        const activities = [
            'Subscribe to ewash on YouTube!',
            'Watching over the Empire for safety!',
            'Banning people ❤'
        ];
    
        setInterval(() => {
            const status = activities[Math.floor(Math.random()*activities.length)];
            client.user.setPresence({activities:[{name: `${status}`}]});
        }, 3000);
    })
})();


client.on("messageCreate", (message) =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLocaleLowerCase();

    //message array

    const messageArray = message.content.split(" ");
    const argument = messageArray.slice(1);
    const cmd = messageArray[0];


    //COMMANDS

    //PURGE
    if(command ==='purge'){
        const amount = parseInt(args[0])
        
        if(!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.channel.send("You do not have the permission to execute this command");
        if(!amount) return message.channel.send("Please specify the amount of messages you want to delete.");
        if(amount > 100 || amount < 1) return message.channel.send("Please select the number beteween 1-100.");

        message.channel.bulkDelete(amount).catch(err =>{
            message.channel.send("Due to Discord limitations I cannot delete messages older than 14 days.")
        })
        
        const embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`:white_check_mark: Deleted **${amount}** messages.`)
        message.channel.send({embeds:[embed]})

    }




    //BANCOMMAND

    if(command === 'ban'){
        const member = message.mentions.members.first() || message.guild.members.cache.get(argument[0]) || message.guild.members.cache.find(x=> x.user.username.toLowerCase() === argument.slice(0).join(" " || x.user.username === argument[0]));
    
        if(!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.channel.send("You don't have permissions to ban people in this server!");
        if(!member) return member.channel.send("You must specify someone in this command!")
        if(message.member === member) return message.channel.send("You cannot ban yourself");
        if(!member.kickable) return message.channel.send("You cannot ban this person!");


        let reason = argument.slice(1).join(" ") || "No reason given."

        const embed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`:white_check_mark: ${member.user.tag} has been **banned**. | ${reason}`)

        const dmEmbed = new EmbedBuilder()
        .setColor("Random")
        .setDescription(`:white_check_mark: You were **banned**. from ${message.guild.message} | ${reason}`)

        member.send({embeds:[dmEmbed]}).catch(err =>{
            console.log(`${member.user.tag} has their DMs off and cannot recieve the ban message.`);
        })

        member.ban().catch(err =>{
            message.channel.send("There was an error banning this person.");
        })

        message.channel.send({embeds:[embed]});


    
    }

    //testCommands

    if(command === 'isworking') {
        message.channel.send("Bot is working!")
    }

















})





