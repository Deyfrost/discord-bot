//------------------- DEFINITION VARIABLES -------------------\\

var Discord = require('discord.js');
var { SlashCommandBuilder } = require("@discordjs/builders")
var Client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MEMBERS
    ]
});

const prefix = "*";
var data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("renvoie pong à un utilisateur")
    .addUserOption(option => option
        .setName("utilisateur")
        .setDescription("Utilisateur que vous souhaitez mentionner")
        .setRequired(true));

//------------------- COMMANDE PING ET {HELP (EMBED)} -------------------\\ https://discord.gg/Zv2ewpFN

Client.on("messageCreate", message => {
    if (message.author.bot) return;
    
    if(message.content === prefix + "count"){
        message.reply(`Nous sommes actuellement ${message.guild.memberCount} sur le serveur.`);
    }
    else if(message.content === prefix + "help"){
        const embed = new Discord.MessageEmbed()
            .setColor("#923434")
            .setTitle("Liste des commandes")
            .setAuthor("Deyfrost59®")
            .setDescription("Vous y trouverez la liste des commandes du bot")
            .addFields(
                { name : '__*help__', value: "***Vous permez d'afficher la liste des commandes du bot.***"},
                { name : '__*ping__', value: "***Vous permez d'afficher votre ping ainsi que celui du bot.***"},
            )
        
        message.delete()    
        message.channel.send({ embeds: [embed]});
    }
});


//------------------- MESSAGE D'ARRIVEES ET D'EPARTS + ROLES -------------------\\

Client.on("guildMemberAdd", member => {
    console.log("Un membre à rejoins le serveur.");
    Client.channels.cache.get("991086906567692405").send("<@" + member.id + "> est arrivé sur le serveur. \nBienvenue à toi !\n Passe lire le règlement dans <#991086906567692407>");
    member.roles.add("991086906316054579");
});


Client.on("guildMemberRemove", member => {
    console.log("Un membre à quitté.");
    Client.channels.cache.get("991086906567692406").send(member.displayName + " à quitté le serveur.");
});


//------------------- BOUTONS -------------------\\

Client.on("messageCreate", message => {
    if(message.content === prefix + "bouton"){
        var row = new Discord.MessageActionRow()
            .addComponents(new Discord.MessageButton()
                .setCustomId("Bouton1")
                .setLabel("Appuyez")
                .setStyle("DANGER")
                .setEmoji("📩")
            );

        message.channel.send({content: "message avec bouton", components: [row]});
    }
    else if(message.content === prefix + "Bouton-vote"){
        var row = new Discord.MessageActionRow()
            .addComponents(new Discord.MessageButton()
                .setLabel("Top-Serveur")
                .setStyle("LINK")
                .setEmoji("💻")
                .setURL("https://top-serveurs.net/gta/vote/milowrp-f-a")
            );

        message.channel.send({content: "***__Vote Top-Serveur__*** \n*Voici ci dessous, le lien du top-serveur sur lequel vous pouvez voter afin de soutenir le serveur. \nMerci à vous !*", components: [row]});
    }
})

Client.on("interactionCreate", interaction => {
    if(interaction.isButton()){
        if(interaction.customId === "Bouton1"){
            interaction.reply({content: "Félicitation ! Ceci n'est qu'un simple test :) \nMerci d'avoir appuyé sur le bouton !", ephemeral: true});
        }
    };
});

Client.on("messageCreate",  message => {
        if(message.content === prefix + "Bouton-vote"){
            interaction.reply({content: "Vous allez être redirigé vers le lien du top serveur !", ephemeral: true});
    }
})

//------------------- MENU DE SELECTION -------------------\\

Client.on("messageCreate", message => {
    if(message.author.bot) return;

    if(message.content === prefix + "selection-menu"){
        var row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId("select")
                    .setPlaceholder("Selectionnez une option")
                    .addOptions([
                        {
                            label: "première option",
                            description: "première description",
                            value: "option1"
                        },
                        {
                            label: "deuxième option",
                            description: "deuxième description",
                            value: "option2"
                        }
                    ])
            );
    
        message.channel.send({content: "menu de selection", components: [row]});
}})

Client.on("interactionCreate", interaction => {
    if(interaction.isSelectMenu()){
        if(interaction.customId === "select"){
            console.log(interaction.values);

            if(interaction.values == "option1"){
                interaction.reply({content: "Vous avez séléctionné l'option une", ephemeral: true});
            }
            else if(interaction.values == "option2"){
                interaction.reply({content: "Vous avez séléctionné l'option deux", ephemeral: true});
            }
        }
    }
})


//------------------- COMMANDE DE CLEAR -------------------\\

var data = new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Commande pour supprimer des messages.")
    .addIntegerOption( option => 
        option.setName("number")
            .setDescription("Nombre de messages que vous souhaitez suppimer")
            .setRequired(true)
    );

Client.on("interactionCreate", interaction => {
    if(interaction.isCommand()){
        if(interaction.commandName === "clear"){
            var number = interaction.options.getInteger("number");

            if(number >= 1 == number <= 100){
                interaction.channel.bulkDelete(number);
                interaction.reply({content: number + " message(s) correctement supprimé(s)", ephemeral: false});
            }
            else {
                interaction.reply({content: "Le nombre de messages supprimés doit être situé entre 1 et 100 ! ", ephemeral: false});
            }
        }
    }
})


Client.on("interactionCreate", interaction => {
    if(interaction.isCommand()){
        if(interaction.commandName === "ping"){
            let user = interaction.options.getUser("utilisateur")

            if(user != undefined){
                interaction.reply("pong <@" + user.id + ">")
            }
            else {
                interaction.reply("pong");
            }
        }
    }
})

//------------------- READY -------------------\\

Client.on("ready", async () => {

    //Client.application.commands.create(data);
    Client.guilds.cache.get("991086906316054578").commands.create(data);
    //Client.application.commands.create(data);

    //await Client.guilds.cache.get("991086906316054578").commands.fetch();

    //Client.guilds.cache.get("991086906316054578").commands.cache.map(command => {
    //    command.delete();
    //});

    //var row = new Discord.MessageActionRow()
    //    .addComponents(new Discord.MessageButton()
    //       .setCustomId("open-ticket")
    //       .setLabel("ouvrir un ticket")
    //       .setStyle("PRIMARY")
    //       .setEmoji("🎫")
    //    );
    //
    //Client.channels.cache.get("991086906764849182").send({content: "Appuyez sur le bouton pour ouvrir un ticket", components: [row]});

    console.log("Bot en Ligne et prêt !")
});


//------------------- READY -------------------\\

var nbTicket = 0;
let role1 = "991086906328629376"

Client.on("interactionCreate", interaction => {
    if(interaction.isButton()){
        if(interaction.customId === "open-ticket"){
            nbTicket++;

            interaction.guild.channels.create("ticket-" + nbTicket, {
                parent: "991086906567692401",
                permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [Discord.Permissions.FLAGS.VIEW_CHANNEL]
                        },
                        {
                            id: role1,
                            allow: [Discord.Permissions.FLAGS.VIEW_CHANNEL]
                        },
                        {
                            id: interaction.user.id,
                            allow: [Discord.Permissions.FLAGS.VIEW_CHANNEL]
                        }
                ]
            }).then(channel => {
                var row = new Discord.MessageActionRow()
                    .addComponents(new Discord.MessageButton()
                        .setCustomId("close-ticket")
                        .setLabel("fermer le ticket")
                        .setStyle("DANGER")
                    );

                channel.send({content: "<@" + interaction.user.id + "> Voici votre ticket, vous pouvez le fermer en appuyant sur le bouton ci-dessous \nUn <@&991086906328629376> s'occupera de vous !", components: [row]})

                interaction.reply({content: "Ticket correctement ouvert !", ephemeral: true})
            });
        }
        else if(interaction.customId === "close-ticket"){
            interaction.channel.setParent("991086907435917444");

            var row = new Discord.MessageActionRow()
                .addComponents(new Discord.MessageButton()
                    .setCustomId("delete-ticket")
                    .setLabel("supprimer le ticket")
                    .setStyle("DANGER")
                );

            interaction.message.delete();

            interaction.channel.send({content: "Supprimer le ticket :", components: [row]});

            interaction.reply({content: "ticket archivé", ephemeral: true});
        }
        else if(interaction.customId === "delete-ticket"){
            interaction.channel.delete();
        }
    }
})

//------------------- CONNECTION BOT AU SCRIPT -------------------\\

Client.login(process.env.TOKEN)//process.env.TOKEN
