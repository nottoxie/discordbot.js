const {slashCommandBuilder, PermissionFlagsBits, SlashCommandBuilder} = require('@discordjs/builders');

module.exports ={
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban people using this command.')
    .addUserOption(option => 
                    option.setName("user")
                    .setDescription("The user to be banned")
                    .setRequired(true)
                    ),
    async execute(interaction, client){
        const user= interaction.options.getUser('user');
        interaction.guild.members.ban(user);
        console.log(user);
    }
}