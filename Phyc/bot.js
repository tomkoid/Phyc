// Imports
const { Client, Intents, MessageEmbed, Permissions } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES] });
const Crypto = require('crypto'); // Used for 1pg
const nekosapi = require('nekos.life'); // ! This API don't work on repl.it ! Used for image commands and for 1owoify
const neko = new nekosapi();
const fs = require("fs"); // This module is used for reading config and database files
const os = require('os'); // Used for system details
const https = require('https'); // Used for commands, that requests some API
const axios = require('axios'); // Also used for commands and update checker

// Initialize
let config;

if (fs.existsSync("config.json")) {
    const tmpconfig = fs.readFileSync("config.json");
    config = JSON.parse(tmpconfig);
} else {
    console.log("\033[0;32m==> ERROR: config.json not found\033[0m");
    process.exit(0);
}

if (config.ENABLE_DEBUG) {
    console.log("\033[0;33m[Node] Initializing..\033[0m");
}

if (!fs.existsSync("database.json")) {
    jsontemplate = "{}"
    fs.writeFileSync("database.json", jsontemplate)
}

if (config.LOG_MESSAGES_INTO_FILE) {
    if (!fs.existsSync("messages.log")) {
        fs.writeFileSync("messages.log", "-------------------------------------------------------")
    }
}

// Imports from config.json

// ↓ Don't change
const version = "v3.1"; // Don't change the version! It can cause problems.
const debug = config.ENABLE_DEBUG;

const usereplit = config.REPLIT_USE; // Uses TOKEN from SECRETS and its useful for hosting on repl.it

const botname = config.BOTNAME;
const botownerid = config.BOTOWNERID;
const giveauthorcredits = config.GIVE_AUTHOR_CREDITS // Adds author credits (github, info) to bot ping

const showlogintoken = config.SHOW_TOKEN_ON_LOGIN; // Shows TOKEN in console when logging in
const showsysinfo = config.SHOW_SYS_INFO_ON_LOGIN; // Shows system info when logging in

const onlinemessage = config.BOT_ONLINE_MESSAGE; // Sends message, that bot is online into specific channel
const onlinemessagechannelid = config.BOT_ONLINE_MESSAGE_CHANNEL_ID; // If above is true, you must set to this your channel ID

const logmessages = config.LOG_MESSAGES; // Logs all messages sended in all channels, where Phyc has permission to view the channel into console
const logmessagesminsyntax = config.LOG_MESSAGES_MINIMAL_SYNTAX;

const nordenabled = config.ENABLE_NORDVPN; // Enables NordVPN command

let TOKEN = fs.readFileSync("config.json");
let timezone = config.TIMEZONE; // Sets timezone for logging messages

if (usereplit) {
    TOKEN = process.env.TOKEN;
    
    // Hosts HTTP server, that helps to run bot continuously
    const server = require("./server");
    server(); // Starts HTTP server
} else {
    TMP_TOKEN = JSON.parse(TOKEN);
    TOKEN = TMP_TOKEN.TOKEN;
}

// Replit nekos.life error embed
let replitnekoerr = new MessageEmbed().setColor("RED").setTitle("nekos.life API");
replitnekoerr.addField("ERROR", "**nekos.life API can't be requested on repl.it, because repl.it started using FFD by Cloudflare (Family Friendly DNS), that blocks this API.**");

// Timezone
process.env.TZ = timezone;

// Functions
function randomString(size = parseInt(passwordsize)) {  
    // Returns random string (used by 1pg command)
    return Crypto
        .randomBytes(size = parseInt(passwordsize))
        .toString('base64')
        .slice(0, size)
    }

function randomnum(min, max) {  
    return Math.floor(
        // Generates random number (used by 1work, 1nordvpn, etc. commands)
        Math.random() * (max - min) + min
    )
}

// Update checker
function checkforupdates() {
    // ↓ Gets mirror
    axios.get("https://raw.githubusercontent.com/Tomkoid/Phyc/stable/mirror.txt").then(mir => {
        // ↓ Gets data from mirror
        axios.get(mir.data.toString().split("\n")[0] + "latestversion.txt").then(res => {
            if(res.data.toString()!=version) {
                console.log("\033[0;33m==> [Updates] Update " + res.data.toString() + " found. Download it on GitHub!\033[0m");
            } else {
                console.log("\033[0;32m==> [Updates] No update found.\033[0m");
            }
        }).catch(() => {
            // Handling
            console.log("\033[0;31m==> [Updates] Can't connect to mirror\033[0m");
        });
    }).catch(() => {
        // Handling
        console.log("\033[0;31m==> [Updates] Can't connect to GitHub\033[0m");
    })
}

function phycexit(statuscode) {
    switch(statuscode) {
        case 0:
            console.log("\033[0;32m[Node] Exiting..\033[0m");
            break;
        case 1:
            console.log("\033[0;31m[Node] Exiting..\033[0m");
    }
    process.exit(parseInt(statuscode));
}

// ↓ Question: https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Basic calculator
function calculator(number1, operator, number2) {
    if(isNaN(number1)) {
        return "wrongnumber";
    } else if(isNaN(number2)) {
        return "wrongnumber";
    }
    switch(operator) {
        case "+":
            returnednumber = number1 + number2;
            break;
        case "-":
            returnednumber = number1 - number2;
            break;
        case "*":
            returnednumber = number1 * number2;
            break;
        case "/":
            returnednumber = number1 / number2;
            break;
        default:
            returnednumber = "invalidop";
    }
    return returnednumber;
}

// Globals
imageurl = "none"
let numberofnordaccounts;
let lastnordaccupdate;
let nordrandnum;

// On ready
client.once("ready", client => {
    // ↓ Logged message
    console.log("\033[0;32m==> [" + botname + "] Logged in as " + client.user.tag +"!\033[0m")
    discordstatus = config.DISCORD_STATUS
    if(onlinemessage) {
        // If onlinemessagechannelid is not assigned, then it returns back to message event
        if(onlinemessagechannelid=="") {
            return console.log("\033[0;31m==> [" + botname + "]: Channel ID has not been defined\033[0m")
        }
        try {
            // Get date
            let dateobject = new Date();
            // Format date
            let curtime = "[" + dateobject.getHours() + "h " + dateobject.getMinutes() + "m " + dateobject.getSeconds() + "s]";
            let onlinemsgembed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**ONLINE**")
            .setDescription("**" + curtime + "**: Bot is online!")
            .setFooter({text: "You can stop bot by 1stop command."})
            client.channels.cache.get(onlinemessagechannelid).send({embeds: [onlinemsgembed]}).catch(() => {
                // Handling
                console.log("\033[0;31m[" + botname + "]: Error when sending message to online msg channel. Try to run 1perms command in the given channel\033[0m");
            })
        } catch(error) {
            console.log("\033[0;31m[" + botname + "]: Error while sending message to onlinemessagechannel: " + error + "\033[0m")
        }
    }
    //let i = 0;
    setInterval(() => {
        let statuslist = [discordstatus, config.DISCORD_STATUS_2, config.DISCORD_STATUS_3, config.DISCORD_STATUS_4, config.DISCORD_STATUS_5];
        let currentstatus = statuslist[randomnum(0, 5)];
        if(currentstatus=="none") {
            return;
        }
        client.user.setActivity(currentstatus);
    }, config.DISCORD_STATUS_INTERVAL)
})

// On message
client.on("messageCreate", async msg => {
    authormessage = msg.author.tag;

    // If sended message is by this bot, then it returns
    if (msg.author == client.user) {
        return;
    }

    // If user sended this message is bot, then it returns
    if (msg.author.bot) return;

    // If messages.log file don't exist, then it will create it automatically
    if (config.LOG_MESSAGES_INTO_FILE) {
        if (!fs.existsSync("messages.log")) {
            fs.writeFileSync("messages.log", "-------------------------------------------------------");
        }
    }

    // If logmessages bool is enabled, then it shows every message send, where is this bot
    if (logmessages) {
        if (logmessagesminsyntax) {
            let dateobject = new Date();
            let curseconds;
            let curminutes;
            let curhours;
            // ↓ Formatting correctly
            switch(dateobject.getSeconds().toString()) {
                case "0":
                    curseconds = "00";
                    break;
                case "1":
                    curseconds = "01";
                    break;
                case "2":
                    curseconds = "02";
                    break;
                case "3":
                    curseconds = "03";
                    break;
                case "4":
                    curseconds = "04";
                    break;
                case "5":
                    curseconds = "05";
                    break;
                case "6":
                    curseconds = "06";
                    break;
                case "7":
                    curseconds = "07";
                    break;
                case "8":
                    curseconds = "08";
                    break;
                case "9":
                    curseconds = "09";
                    break;
                default:
                    curseconds = dateobject.getSeconds();
            }
            switch(dateobject.getMinutes().toString()) {
                case "0":
                    curminutes = "00";
                    break;
                case "1":
                    curminutes = "01";
                    break;
                case "2":
                    curminutes = "02";
                    break;
                case "3":
                    curminutes = "03";
                    break;
                case "4":
                    curminutes = "04";
                    break;
                case "5":
                    curminutes = "05";
                    break;
                case "6":
                    curminutes = "06";
                    break;
                case "7":
                    curminutes = "07";
                    break;
                case "8":
                    curminutes = "08";
                    break;
                case "9":
                    curminutes = "09";
                    break;
                default:
                    curminutes = dateobject.getMinutes();
            }
            switch(dateobject.getHours().toString()) {
                case "0":
                    curhours = "00";
                    break;
                case "1":
                    curhours = "01";
                    break;
                case "2":
                    curhours = "02";
                    break;
                case "3":
                    curhours = "03";
                    break;
                case "4":
                    curhours = "04";
                    break;
                case "5":
                    curhours = "05";
                    break;
                case "6":
                    curhours = "06";
                    break;
                case "7":
                    curhours = "07";
                    break;
                case "8":
                    curhours = "08";
                    break;
                case "9":
                    curhours = "09";
                    break;
                default:
                    curhours = dateobject.getHours();
            }
            let curtime = "[" + curhours + ":" + curminutes + ":" + curseconds + "]";
            console.log("\n" + curtime + " " + authormessage + " (#" + msg.channel.name + " | " + msg.guild.name + ") > " + msg.content);
            if(config.LOG_MESSAGES_INTO_FILE) {
                let msglog = fs.readFileSync("messages.log");
                fs.writeFileSync("messages.log", msglog.toString() + "\n" + curtime + " " + authormessage + " (#" + msg.channel.name + " | " + msg.guild.name + ") > " + msg.content)
            }
        } else {
            let dateobject = new Date();
            let curtime = "[" + dateobject.getHours() + "h " + dateobject.getMinutes() + "m " + dateobject.getSeconds() + "s]";
            console.log("\n" + curtime + " " + authormessage + " sended message in " + msg.channel.name + " in " + msg.guild.name);
            console.log("Content: " + msg.content);
            if(config.LOG_MESSAGES_INTO_FILE) {
                let msglog = fs.readFileSync("messages.log");
                fs.writeFileSync("messages.log", msglog.toString() + "\n" + curtime + " " + authormessage + " (#" + msg.channel.name + " | " + msg.guild.name + ") > " + msg.content)
            }
        }
    }

    // Check if sended message is by webhook
    if (msg.webhookId) return;

    // Permissions
    if(!msg.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) {
        return;
    }

    if(!msg.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES_IN_THREADS)) {
        return;
    }
    
    /*Perms command, that checks if you have permissions, that this bot needs.
    If bot doesn't output anything, then bot doesn't have permissions to send messages.*/
    if (msg.content == "1perms") {
        let permissioncount = 0;
        if(!msg.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            msg.channel.send("**ERROR**: The bot doesn't have permission to manage messages.").catch(() => {return});
            permissioncount++;
        }
    
        if(!msg.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)) {
            msg.channel.send("**ERROR**: The bot doesn't have permission to embed links.").catch(() => {return});
            permissioncount++;
        }
    
        if(!msg.guild.me.permissions.has(Permissions.FLAGS.ATTACH_FILES)) {
            msg.channel.send("**ERROR**: The bot doesn't have permission to attach files.").catch(() => {return});
            permissioncount++;
        }
    
        if(!msg.guild.me.permissionsIn(msg.channel.id).has(Permissions.FLAGS.EMBED_LINKS)) {
            msg.channel.send("**ERROR**: The bot doesn't have permission to embed links in this channel.").catch(() => {return});
            permissioncount++;
        }
    
        if(!msg.guild.me.permissionsIn(msg.channel.id).has(Permissions.FLAGS.ATTACH_FILES)) {
            msg.channel.send("**ERROR**: The bot doesn't have permission to attach files in this channel.").catch(() => {return});
            permissioncount++;
        }

        if(!msg.guild.me.permissionsIn(msg.channel.id).has(Permissions.FLAGS.ADD_REACTIONS)) {
            msg.channel.send("**ERROR**: The bot doesn't have permission to add reactions in this channel.").catch(() => {return});
            permissioncount++;
        }

        if(!msg.guild.me.permissionsIn(msg.channel.id).has(Permissions.FLAGS.READ_MESSAGE_HISTORY)) {
            msg.channel.send("**ERROR**: The bot doesn't have permission to read message history in this channel.").catch(() => {return});
            permissioncount++;
        }


        if(!msg.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            msg.channel.send("**WARNING**: The bot doesn't have permission to kick members, which is required for kick command").catch(() => {return});
            permissioncount++;
        }

        if(!msg.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            msg.channel.send("**WARNING**: The bot doesn't have permission to ban members, which is required for ban command").catch(() => {return});
            permissioncount++;
        }

        if(!msg.guild.me.permissionsIn(msg.channel.id).has(Permissions.FLAGS.KICK_MEMBERS)) {
            msg.channel.send("**WARNING**: The bot doesn't have permission to kick members in this channel.").catch(() => {return});
            permissioncount++;
        }

        if(!msg.guild.me.permissionsIn(msg.channel.id).has(Permissions.FLAGS.BAN_MEMBERS)) {
            msg.channel.send("**WARNING**: The bot doesn't have permission to ban members in this channel.").catch(() => {return});
            permissioncount++;
        }

        const permsembed = new MessageEmbed()
        if(permissioncount==0) {
            permsembed.setColor("GREEN");
        } else {
            permsembed.setColor("RED");
        }
        permsembed.setTitle("**PERMS**")
        if(permissioncount==0) {
            permsembed.setDescription("**SUCCESS**: No problem in perms found");
        } else {
            if(permissioncount>1) {
                permsembed.setDescription("**FAIL**: " + permissioncount + " permissions are'nt granted");
            } else {
                permsembed.setDescription("**FAIL**: " + permissioncount + " permission isn't granted");
            }
        }
        return msg.reply({embeds: [permsembed] }).catch(() => {return});
    }
    if(!msg.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
        return;
    }

    if(!msg.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)) {
        return;
    }

    if(!msg.guild.me.permissions.has(Permissions.FLAGS.ATTACH_FILES)) {
        return;
    }

    if(!msg.guild.me.permissionsIn(msg.channel.id).has(Permissions.FLAGS.EMBED_LINKS)) {
        return;
    }

    if(!msg.guild.me.permissionsIn(msg.channel.id).has(Permissions.FLAGS.ATTACH_FILES)) {
        return;
    }
    
    if(!msg.guild.me.permissionsIn(msg.channel.id).has(Permissions.FLAGS.ADD_REACTIONS)) {
        return;
    }

    if(!msg.guild.me.permissionsIn(msg.channel.id).has(Permissions.FLAGS.READ_MESSAGE_HISTORY)) {
        return;
    }

    // Commands
    try {
        // If someone will tag this bot, then it returns this embed
        if (msg.content == "<@!" + client.user.id + ">"||msg.content == "<@" + client.user.id + ">") {
            if (msg.author === client.user) {
                return;
            }
            const phycembed = new MessageEmbed()
            phycembed.setColor("GREEN");
            phycembed.setTitle("PHYC");
            if(giveauthorcredits) {
                phycembed.addField("INFO", "**Phyc is utility & fun open-source bot made by Tomkoid#4637**");
                phycembed.addField("GITHUB", "https://github.com/Tomkoid/Phyc");
            }
            phycembed.addField("BOT INVITE", "**You can get bot invite using 1botinvite command.**")
            phycembed.addField("HELP", "**You can use 1help to see all commands.**");
            phycembed.setFooter({text: "Executed by " + msg.author.tag});
            return msg.reply({ embeds: [phycembed] }).catch(() => {return});
        }

        // Help command
        if (msg.content === "1help") {
            const helpembed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**PHYC HELP**\n")
            .addField("Moderation", "1kick|1ban|1clear|1poll|1warn|1perms")
            .addField("Fun", "1work|1meme|1stonks|1gay|1reverse|1owoify|1pg")
            .addField("Images", "1cat|1dog|1goose|1lizard|1tpdne")
            .addField("AntiLink", "1antilink <on/off>")
            .addField("Minecraft Status", "1mc|1mcserver|1mcpeserver")
            .addField("Minecraft Status Management", "1mcserverset|1mcpeserverset|1mcserverrm|1mcpeserverrm")
            .addField("Accounts", "1nordvpn|1nordvpnreport")
            .addField("Only Bot Owners", "1statusrel|1blacklist|1stop")
            .addField("Other", "1ping|1forceleave|1github")
            .setFooter({text: "Version: " + version})
            return msg.reply({ embeds: [helpembed] }).catch(() => {return});
        }
        
        if (msg.content === "1botinvite") {
            let botinvem = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**BOT INVITE**")
            .addField("CUSTOMIZABLE INVITE (allow only what you want)", "https://discord.com/api/oauth2/authorize?client_id=" + client.user.id + "&permissions=1642824990455&scope=bot")
            .addField("ADMINISTRATOR INVITE (all permissions)", "https://discord.com/api/oauth2/authorize?client_id=" + client.user.id + "&permissions=8&scope=bot")
            .addField("MODERATOR INVITE (permissions for moderation and basic use)", "https://discord.com/api/oauth2/authorize?client_id=" + client.user.id + "&permissions=16425560305358&scope=bot")
            .addField("BASIC INVITE (permissions for basic use and can't be used for moderation)", "https://discord.com/api/oauth2/authorize?client_id=" + client.user.id + "&permissions=515500408385&scope=bot")
            return msg.reply({embeds: [botinvem]}).catch(() => {return});
        }

        if(msg.content === "1invite") {
            let invite = await msg.channel.createInvite({
                maxAge: 0,
                maxUses: 0
            }).catch(err => {
                let inviteemerr = new MessageEmbed()
                .setColor("RED")
                .setTitle("**SERVER INVITE**")
                .setDescription("**UNKNOWN ERROR**: Unable to create server invite");
                if(debug) console.log("==> ERROR: " + err);
                return msg.reply({embeds: [inviteemerr]}).catch(() => {return});
            });
            if(debug) console.log("Invite: " + invite.toString());
            let inviteem = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**SERVER INVITE**")
            .addField("**INVITE URL**", invite.toString());
            return msg.reply({embeds: [inviteem]}).catch(() => {return});
        }

        if (msg.content === "1stop") {
            if(msg.author.id!=botownerid) {
                return;
            }
            let stopped = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**STOP**")
            .setDescription("Bot stopped.");
            msg.reply({embeds: [stopped]}).catch(() => {return});
            if(debug) {
                console.log("Bot is stopping..")
            }
            return phycexit(0);
        }

        // If AntiLink is on, messages with URL links will be deleted
        if (msg.content.includes("http://")||msg.content.includes("https://")) {
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(msgauthor.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                return;
            }
            let data = fs.readFileSync("database.json", "utf8");
            let database = JSON.parse(data)
            let antilinkloc = "antilink-" + msg.guild.id
            if(database[antilinkloc] === "yes") {
                console.log(msg.author.tag + " sended link in " + msg.guild.id + " when autolink was on")
                if(msg.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                    try {
                        msg.delete().catch(() => {
                            // Handling
                            return;
                        })
                    } catch(error) {
                        // Handling
                        console.log(error);
                    }
                } else {
                    return msg.reply("Bot don't have permission to MANAGE_MESSAGES").catch(() => {return})
                }
            }
        } else if (msg.content.includes("ftp://")||msg.content.includes("ftps://")) {
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(msgauthor.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                return;
            }
            let data = fs.readFileSync("database.json", "utf8");
            let database = JSON.parse(data)
            let antilinkloc = "antilink-" + msg.guild.id
            if(database[antilinkloc] === "yes") {
                if(logmessages) {
                    console.log(msg.author.tag + " sended link in " + msg.guild.id + " when autolink was on")
                }
                if(msg.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                    try {
                        msg.delete().catch(() => {
                            return;
                        });
                    } catch(error) {
                        console.log(error);
                    }
                } else {
                    return msg.reply("Bot doesn't have permission to MANAGE_MESSAGES").catch(() => {return})
                }
            }
        } else if (msg.content.includes("file://")) {
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(msgauthor.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                return
            }
            let data = fs.readFileSync("database.json", "utf8");
            let database = JSON.parse(data)
            let antilinkloc = "antilink-" + msg.guild.id
            if(database[antilinkloc] === "yes") {
                console.log(msg.author.tag + " sended link in " + msg.guild.id + " when autolink was on")
                if(msg.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                    try {
                        msg.delete().catch(() => {
                            return
                        });
                    } catch(error) {
                        console.log(error)
                    }
                } else {
                    msg.reply("Bot don't have permission to MANAGE_MESSAGES").catch(() => {return})
                }
            }
        }
        

        // AntiLink toggle
        if (msg.content.startsWith("1antilink on")) {
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(!msgauthor.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
                const notconfigured = new MessageEmbed()
                .setColor("RED")
                .setTitle("**ANTILINK**")
                .setDescription("**ERROR**: Permission denied")
                return msg.reply({embeds: [notconfigured]}).catch(() => {return})
            }
            let data = fs.readFileSync("database.json", "utf8");
            let database = JSON.parse(data)
            var newvalue = "antilink-" + msg.guild.id
            database[newvalue] = "yes";
            let databasejson = JSON.stringify(database)
            fs.writeFileSync("database.json", databasejson)

            const configured = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**ANTILINK**")
            .setDescription("**SUCESS**: Configured antilink to ON on this server")
            await msg.reply({embeds: [configured]}).catch(() => {return})
        } else if (msg.content.startsWith("1antilink off")) {
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(!msgauthor.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
                const notconfigured = new MessageEmbed()
                .setColor("RED")
                .setTitle("**ANTILINK**")
                .setDescription("**ERROR**: Permission denied")
                return msg.reply({embeds: [notconfigured]}).catch(() => {return})
            }
            let data = fs.readFileSync("database.json", "utf8");
            let database = JSON.parse(data)
            var newvalue = "antilink-" + msg.guild.id
            database[newvalue] = "no";
            let databasejson = JSON.stringify(database)
            fs.writeFileSync("database.json", databasejson)

            const configured = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**ANTILINK**")
            .setDescription("**SUCESS**: Configured antilink to OFF on this server")
            return msg.reply({embeds: [configured]}).catch(() => {return})
        }

        // If message author has permissions to MANAGE SERVER, then you can easily remove this bot from server
        if (msg.content == "1forceleave") {
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if (!msgauthor.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
                const noadmin = new MessageEmbed()
                .setColor("RED")
                .setTitle("Force-Leave")
                .setDescription("**ERROR**: Permission denied")
                .setFooter({text: "Executed by " + msg.author.tag})
                return msg.reply({embeds: [noadmin] }).catch(() => {return})
            }
            const leave = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("Force-Leave")
            .setDescription("**SUCCESS**: Bot leaved")
            .setFooter({text: "Executed by " + msg.author.tag})
            msg.reply({embeds: [leave] }).catch(() => {return});
            return msg.guild.leave();
        }

        if (msg.content.startsWith("1mcserverset")) {
            args = msg.content.split(' ');
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(!msgauthor.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
                const noperms = new MessageEmbed()
                .setColor("RED")
                .setTitle("**MC SERVER STATUS**")
                .setDescription("**ERROR**: Permission denied")
                return msg.reply({embeds: [noperms]}).catch(() => {return})
            }
            if(args[1]==undefined) {
                const undefinedargs = new MessageEmbed()
                .setColor("RED")
                .setTitle("**MC SERVER STATUS**")
                .setDescription("**USAGE**: 1mcserverset <ip:port>")
                return msg.reply({embeds: [undefinedargs]}).catch(() => {return})
            }
            if(args[1]=="none") {
                const noneset = new MessageEmbed()
                .setColor("RED")
                .setTitle("**MC SERVER STATUS**")
                .setDescription("**ERROR**: You can't set server as none")
                return msg.reply({embeds: [noneset]}).catch(() => {return})
            }
            let mcdata = fs.readFileSync("database.json", "utf8");
            let mcdatabase = JSON.parse(mcdata)
            let mcserverloc = "mcserver-" + msg.guild.id
            mcdatabase[mcserverloc] = args[1].toString()
            let mcdatabasejson = JSON.stringify(mcdatabase)
            fs.writeFileSync("database.json", mcdatabasejson)
            const successserverset = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**MC SERVER STATUS**")
            .setDescription("**SUCCESS**: Server set to " + args[1].toString())
            return msg.reply({embeds: [successserverset]}).catch(() => {return})
        }

        if (msg.content == "1mcserver") {
            let mcdata = fs.readFileSync("database.json", "utf8");
            let mcdatabase = JSON.parse(mcdata)
            let mcserverloc = "mcserver-" + msg.guild.id
            if(mcdatabase[mcserverloc]==null||mcdatabase[mcserverloc]=="none") {
                const noserver = new MessageEmbed()
                .setColor("RED")
                .setTitle("**MC SERVER STATUS**")
                .setDescription("**ERROR**: No server configured")
                return msg.reply({embeds: [noserver]}).catch(() => {return})
            }
            https.get("https://api.mcsrvstat.us/2/" + mcdatabase[mcserverloc],(res) => {
                let body = "";
            
                res.on("data", (chunk) => {
                    body += chunk;
                });
            
                res.on("end", () => {
                    try {
                        if (body.startsWith("429 Too Many Requests")) {
                            const toomanyreq = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("**MC STATUS**")
                            .setDescription("**ERROR**: You must provide **existing** server")
                            return msg.reply({embeds: [toomanyreq] }).catch(() => {return})
                        }
                        let json = JSON.parse(body);
                        if (json.online.toString() === "false") {
                            const mcstatusoffline = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("**MC STATUS**")
                            .setDescription("**INFO**: Server is offline or unreachable")
                            return msg.reply({embeds: [mcstatusoffline] }).catch(() => {return})
                        }
                        if (json.motd.clean[0].toString() === "This server is offline.") {
                            const mcaternosstatusoffline = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("**MC STATUS**")
                            .setDescription("**INFO**: Server is offline")
                            return msg.reply({embeds: [mcaternosstatusoffline] }).catch(() => {return})
                        }
                        if (json.motd.clean[0].toString() === "Server not found.") {
                            let mcaternosnotfound = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("**MC STATUS**")
                            .setDescription("**ERROR**: Server not found.")
                            return msg.reply({embeds: [mcaternosnotfound] }).catch(() => {return})
                        }
                        const mcstatus = new MessageEmbed()
                        .setColor("GREEN")
                        .setTitle("**MC STATUS**")
                        .addField("HOSTNAME", json.hostname)
                        .addField("PORT", json.port.toString())
                        .addField("IP", json.ip)
                        .addField("MOTD", json.motd.clean[0])
                        .addField("ONLINE", json.players.online.toString())
                        .addField("MAX", json.players.max.toString())
                        .addField("VERSION", json.version.toString())
                        return msg.reply({embeds: [mcstatus] }).catch(() => {return})
                    } catch (error) {
                        console.error(error.message);
                    };
                });
            
            }).on("error", (error) => {
                console.error(error.message); // Prints catched error
            });
        }

        if (msg.content == "1mcserverrm") {
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(!msgauthor.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
                const noperms = new MessageEmbed()
                .setColor("RED")
                .setTitle("**MC SERVER STATUS**")
                .setDescription("**ERROR**: Permission denied")
                return msg.reply({embeds: [noperms]}).catch(() => {return})
            }
            let mcdata = fs.readFileSync("database.json", "utf8");
            let mcdatabase = JSON.parse(mcdata)
            let mcserverloc = "mcserver-" + msg.guild.id
            mcdatabase[mcserverloc] = "none"
            let mcdatabasejson = JSON.stringify(mcdatabase)
            fs.writeFileSync("database.json", mcdatabasejson)
            const successserverrm = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**MC SERVER STATUS**")
            .setDescription("**SUCCESS**: Removed MC server")
            return msg.reply({embeds: [successserverrm]}).catch(() => {return})
        }

        if (msg.content.startsWith("1mcpeserverset")) {
            args = msg.content.split(' ');
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(!msgauthor.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
                const noperms = new MessageEmbed()
                .setColor("RED")
                .setTitle("**MCPE SERVER STATUS**")
                .setDescription("**ERROR**: Permission denied")
                return msg.reply({embeds: [noperms]}).catch(() => {return})
            }
            if(args[1]==undefined) {
                const undefinedargs = new MessageEmbed()
                .setColor("RED")
                .setTitle("**MCPE SERVER STATUS**")
                .setDescription("**USAGE**: 1mcpeserverset <ip:port>")
                return msg.reply({embeds: [undefinedargs]}).catch(() => {return})
            }
            if(args[1]=="none") {
                const noneset = new MessageEmbed()
                .setColor("RED")
                .setTitle("**MC SERVER STATUS**")
                .setDescription("**ERROR**: You can't set server as none")
                return msg.reply({embeds: [noneset]}).catch(() => {return})
            }
            let mcdata = fs.readFileSync("database.json", "utf8");
            let mcdatabase = JSON.parse(mcdata)
            let mcserverloc = "mcpeserver-" + msg.guild.id
            mcdatabase[mcserverloc] = args[1].toString()
            let mcdatabasejson = JSON.stringify(mcdatabase)
            fs.writeFileSync("database.json", mcdatabasejson)
            const successserverset = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**MCPE SERVER STATUS**")
            .setDescription("**SUCCESS**: Server set to " + args[1].toString())
            return msg.reply({embeds: [successserverset]}).catch(() => {return})
        }

        if (msg.content == "1mcpeserver") {
            let mcdata = fs.readFileSync("database.json", "utf8");
            let mcdatabase = JSON.parse(mcdata)
            let mcserverloc = "mcpeserver-" + msg.guild.id
            if(mcdatabase[mcserverloc]==null||mcdatabase[mcserverloc]=="none") {
                const noserver = new MessageEmbed()
                .setColor("RED")
                .setTitle("**MCPE SERVER STATUS**")
                .setDescription("**ERROR**: No server configured")
                return msg.reply({embeds: [noserver]}).catch(() => {return})
            }
            https.get("https://api.mcsrvstat.us/bedrock/2/" + mcdatabase[mcserverloc],(res) => {
                let body = "";
            
                res.on("data", (chunk) => {
                    body += chunk;
                });
            
                res.on("end", () => {
                    try {
                        if (body.startsWith("429 Too Many Requests")) {
                            const toomanyreq = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("**MC STATUS**")
                            .setDescription("**ERROR**: You must provide **existing** server")
                            return msg.reply({embeds: [toomanyreq] }).catch(() => {return})
                        }
                        let json = JSON.parse(body);
                        if (json.online.toString() === "false") {
                            const mcstatusoffline = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("**MC STATUS**")
                            .setDescription("**INFO**: Server is offline or unreachable")
                            return msg.reply({embeds: [mcstatusoffline] }).catch(() => {return})
                        }
                        if (json.motd.clean[0].toString() === "This server is offline.") {
                            const mcaternosstatusoffline = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("**MC STATUS**")
                            .setDescription("**INFO**: Server is offline")
                            return msg.reply({embeds: [mcaternosstatusoffline] }).catch(() => {return})
                        }
                        if (json.motd.clean[0].toString() === "Server not found.") {
                            let mcaternosnotfound = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("**MC STATUS**")
                            .setDescription("**ERROR**: Server not found.")
                            return msg.reply({embeds: [mcaternosnotfound] }).catch(() => {return})
                        }
                        const mcstatus = new MessageEmbed()
                        mcstatus.setColor("GREEN")
                        mcstatus.setTitle("**MC STATUS**")
                        mcstatus.addField("HOSTNAME", json.hostname)
                        mcstatus.addField("PORT", json.port.toString())
                        mcstatus.addField("IP", json.ip)
                        mcstatus.addField("MOTD", json.motd.clean[0])
                        mcstatus.addField("ONLINE", json.players.online.toString())
                        mcstatus.addField("MAX", json.players.max.toString())
                        if(json.version.toString()!==null && json.version.toString()!=="") mcstatus.addField("VERSION", json.version.toString())
                        msg.reply({embeds: [mcstatus] }).catch(() => {return})
                    } catch (error) {
                        console.error(error.message);
                    };
                });
            
            }).on("error", (error) => {
                console.error(error.message); // Prints catched error
            });
        }

        if (msg.content == "1mcpeserverrm") {
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(!msgauthor.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
                let noperms = new MessageEmbed()
                .setColor("RED")
                .setTitle("**MCPE SERVER STATUS**")
                .setDescription("**ERROR**: Permission denied")
                return msg.reply({embeds: [noperms]}).catch(() => {return})
            }
            let mcdata = fs.readFileSync("database.json", "utf8");
            let mcdatabase = JSON.parse(mcdata)
            let mcserverloc = "mcpeserver-" + msg.guild.id
            mcdatabase[mcserverloc] = "none"
            let mcdatabasejson = JSON.stringify(mcdatabase)
            fs.writeFileSync("database.json", mcdatabasejson)
            let successserverrm = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**MCPE SERVER STATUS**")
            .setDescription("**SUCCESS**: Removed MCPE server")
            return msg.reply({embeds: [successserverrm]}).catch(() => {return});
        }

        if (msg.content == "1mc") {
            const mchelp = new MessageEmbed()
            .setColor("RED")
            .setTitle("**MC STATUS**")
            .setDescription("**USAGE**: 1mc <ip:port>")
            return msg.reply({embeds: [mchelp] }).catch(() => {return})
        }

        if (msg.content.startsWith("1mc ")) {
            args = msg.content.split(' ');
            https.get("https://api.mcsrvstat.us/2/" + args[1],(res) => {
                let body = "";
            
                res.on("data", (chunk) => {
                    body += chunk;
                });
            
                res.on("end", () => {
                    try {
                        if (body.startsWith("429 Too Many Requests")) {
                            const toomanyreq = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("**MC STATUS**")
                            .setDescription("**ERROR**: You must provide **existing** server")
                            return msg.reply({embeds: [toomanyreq] }).catch(() => {return})
                        }
                        let json = JSON.parse(body);
                        if (json.online.toString() === "false") {
                            const mcstatusoffline = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("**MC STATUS**")
                            .setDescription("**INFO**: Server is offline or unreachable")
                            return msg.reply({embeds: [mcstatusoffline] }).catch(() => {return})
                        }
                        if (json.motd.clean[0].toString() === "This server is offline.") {
                            let mcaternosstatusoffline = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("**MC STATUS**")
                            .setDescription("**INFO**: Server is offline")
                            return msg.reply({embeds: [mcaternosstatusoffline] }).catch(() => {return})
                        }
                        if (json.motd.clean[0].toString() === "Server not found.") {
                            let mcaternosnotfound = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("**MC STATUS**")
                            .setDescription("**ERROR**: Server not found.")
                            return msg.reply({embeds: [mcaternosnotfound] }).catch(() => {return})
                        }
                        const mcstatus = new MessageEmbed()
                        .setColor("GREEN")
                        .setTitle("**MC STATUS**")
                        .addField("HOSTNAME", json.hostname)
                        .addField("PORT", json.port.toString())
                        .addField("IP", json.ip)
                        .addField("MOTD", json.motd.clean[0])
                        .addField("ONLINE", json.players.online.toString())
                        .addField("MAX", json.players.max.toString())
                        .addField("VERSION", json.version.toString())
                        return msg.reply({embeds: [mcstatus] }).catch(() => {return})
                    } catch (error) {
                        console.error(error.message);
                    };
                });
            
            }).on("error", (error) => {
                console.error(error.message); // Prints catched error
            });
        }

        if (msg.content == "1mcpe") {
            const mcpehelp = new MessageEmbed()
            .setColor("RED")
            .setTitle("**MC STATUS**")
            .setDescription("**USAGE**: 1mcpe <ip:port>")
            return msg.reply({embeds: [mcpehelp] }).catch(() => {return})
        }

        if (msg.content.startsWith("1mcpe ")) {
            args = msg.content.split(' ');
            https.get("https://api.mcsrvstat.us/bedrock/2/" + args[1],(res) => {
                let body = "";
            
                res.on("data", (chunk) => {
                    body += chunk;
                });
            
                res.on("end", () => {
                    try {
                        if (body.startsWith("429 Too Many Requests")) {
                            const toomanyreq = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("**MC STATUS**")
                            .setDescription("**API ERROR**: You must provide **existing** server")
                            return msg.reply({embeds: [toomanyreq] }).catch(() => {return})
                        }
                        let json = JSON.parse(body);
                        if (json.online.toString() === "false") {
                            const mcstatusoffline = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("**MC STATUS**")
                            .setDescription("**INFO**: Server is offline or unreachable")
                            return msg.reply({embeds: [mcstatusoffline] }).catch(() => {return})
                        }
                        if (json.motd.clean[0].toString() === "This server is offline.") {
                            let mcaternosstatusoffline = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("**MC STATUS**")
                            .setDescription("**INFO**: Server is offline")
                            return msg.reply({embeds: [mcaternosstatusoffline] }).catch(() => {return})
                        }
                        if (json.motd.clean[0].toString() === "Server not found.") {
                            let mcaternosnotfound = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("**MC STATUS**")
                            .setDescription("**ERROR**: Server not found.")
                            return msg.reply({embeds: [mcaternosnotfound] }).catch(() => {return})
                        }
                        const mcstatus = new MessageEmbed()
                        mcstatus.setColor("GREEN")
                        mcstatus.setTitle("**MC STATUS**")
                        mcstatus.addField("IP", json.ip)
                        mcstatus.addField("PORT", json.port.toString())
                        mcstatus.addField("MOTD", json.motd.clean[0].toString())
                        mcstatus.addField("ONLINE", json.players.online.toString())
                        mcstatus.addField("MAX", json.players.max.toString())
                        if(json.version.toString()!==null && json.version.toString()!=="") mcstatus.addField("VERSION", json.version.toString())
                        return msg.reply({embeds: [mcstatus] }).catch(() => {return})
                    } catch (error) {
                        console.error(error.message);
                    };
                });
            
            }).on("error", (error) => {
                console.error(error.message);
            });
        }
        
        if (msg.content === "1statusrel") {
            if(parseInt(msg.author.id) != parseInt(botownerid)) {
                const statuspermissiondenied = new MessageEmbed()
                .setColor("RED")
                .setTitle("**RELOAD STATUS**")
                .setDescription("**ERROR**: You must be ADMIN of " + botname + " to use this command")
                .setFooter({text: "Executed by " + msg.author.tag})
                return msg.reply({embeds: [statuspermissiondenied] }).catch(() => {return})
            }
            setInterval(() => {
                let statuslist = [discordstatus, config.DISCORD_STATUS_2, config.DISCORD_STATUS_3, config.DISCORD_STATUS_4, config.DISCORD_STATUS_5];
                let currentstatus = statuslist[randomnum(0, 5)];
                if(currentstatus=="none") {
                    return;
                }
                client.user.setActivity(currentstatus);
            }, config.DISCORD_STATUS_INTERVAL)
            const statuschanged = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**RELOAD STATUS**")
            .setDescription("**SUCCESS**: Reloaded status")
            .setFooter({text: "Executed by " + msg.author.tag})
            return msg.reply({embeds: [statuschanged] }).catch(() => {return})
        }

        if (msg.content === "1ping") {
            const botpingem = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("PING")
            .setDescription(`**BOT Ping**: ${Date.now() - msg.createdTimestamp}ms\n**API Ping**: ${Math.round(client.ws.ping)}ms`)
            .setFooter({text: "Executed by " + msg.author.tag})

            return msg.reply({ embeds: [botpingem] }).catch(() => {return})
        }

        if (msg.content.startsWith("1clear")) {
            let args = msg.content.split(' ');
            const permissiondeniedem = new MessageEmbed()
            .setColor("RED")
            .setTitle("**CLEAR**")
            .setDescription("**ERROR**: Permission denied")
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(!msgauthor.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                return msg.reply({ embeds: [permissiondeniedem] }).catch(() => {return})
            }
            if (args[1]==undefined) {
                const noargs = new MessageEmbed()
                .setColor("RED")
                .setTitle("**CLEAR**")
                .setDescription("**USAGE**: 1clear [AMOUNT]")
                return msg.reply({ embeds: [noargs] }).catch(() => {return})
            }
            clearamount = parseInt(args[1]) + 1
            if (isNaN(args[1])) {
                const nan = new MessageEmbed()
                .setColor("RED")
                .setTitle("**CLEAR**")
                .setDescription("**USAGE**: 1clear [AMOUNT]")
                return msg.reply({ embeds: [nan] }).catch(() => {return})
            }
            if (clearamount>100) {
                const toomuchamount = new MessageEmbed()
                .setColor("RED")
                .setTitle("**CLEAR**")
                .setDescription("**ERROR**: Clear command can clear only up to 99!")
                return msg.reply({ embeds: [toomuchamount] }).catch(() => {return})
            }
            try {
                msg.channel.bulkDelete(clearamount, true).catch(err => {
                    let bulkdeletefailed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("**CLEAR**")
                    .setDescription("**UNKNOWN ERROR**: Can't clear " + clearamount + " messages!");
                    msg.reply({ embeds: [bulkdeletefailed] }).catch(() => {return});
                    if(debug) {
                        console.log("==> ERROR:" + err);
                    }
                    return;
                })
            } catch(error) {
                msg.reply("Clear failed").catch(() => {return})
            }
            let clearsuccess = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**CLEAR**")
            .setDescription("**SUCCESS**: Cleared " + args[1] + " message/s")
            msg.reply({ embeds: [clearsuccess] }).then(msg => {
                setTimeout(() => msg.delete(), 3000);
            }).catch(() => {
                return;
            })
        }

        if (msg.content === "1meme") {
            randomnumber = randomnum(1, 500)
            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**MEME**")
            .setDescription("Some meme for you")
            .setImage("https://ctk-api.herokuapp.com/meme/" + randomnumber)
            .setFooter({text: "Executed by " + msg.author.tag})
            msg.reply({ embeds: [embed] }).catch(() => {return})
            if(debug) {
                console.log("Meme: https://ctk-api.herokuapp.com/meme/" + randomnumber)
            }
            return;
        }

        if (msg.content.startsWith("1seewarns")) {
            var checkargs = msg.content.split('1seewarns ')[1]
            if(checkargs==undefined) {
                const nowarnsargs = new MessageEmbed()
                .setColor("RED")
                .setTitle("**WARNS**")
                .setDescription("**ERROR**: No arguments\n**USAGE**: 1warns @USER")
                return msg.reply({embeds: [nowarnsargs]}).catch(() => {return})
            }
            var member = msg.mentions.members.first();
            const mentionuserem = new MessageEmbed()
            .setColor("RED")
            .setTitle("**WARN**")
            .setDescription("**ERROR**: Invalid user!\n**USAGE**: 1warn @USER [REASON] (reason is not required)")
            if(!member) return msg.reply({ embeds: [mentionuserem] }).catch(() => {return})
            let warndata = fs.readFileSync("database.json", "utf8");
            let warndatabase = JSON.parse(warndata)
            var warnloc = "warns-" + msg.guild.id + "-" + member.id
            if(warndatabase[warnloc]==null||warndatabase[newvalue]==0) {
                const noseewarns = new MessageEmbed()
                .setColor("GREEN")
                .setTitle("**WARNS**")
                .setDescription(client.users.cache.get(member.id).username + " has no warns")
                return msg.reply({embeds: [noseewarns]}).catch(() => {return})
            }
            const warncountembed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**WARNS**")
            .setDescription(client.users.cache.get(member.id).username + " has " + warndatabase[warnloc] + " warn/s")
            return msg.reply({embeds: [warncountembed]}).catch(() => {return})
            // client.users.cache.get(member.id).username
        }

        if (msg.content.startsWith("1rmwarn")) {
            var member = msg.mentions.members.first();
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            const mentionuserem = new MessageEmbed()
            .setColor("RED")
            .setTitle("**WARN**")
            .setDescription("**ERROR**: You need to mention user or invalid user!\n**USAGE**: 1warn @USER [REASON] (reason is not required)")
            const permissiondeniedem = new MessageEmbed()
            .setColor("RED")
            .setTitle("**WARN**")
            .setDescription("**ERROR**: Permission denied")
            if(!msgauthor.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return msg.reply({embeds: [permissiondeniedem]}).catch(() => {return})
            if(!member) return msg.reply({ embeds: [mentionuserem] }).catch(() => {return})
            if(!member.kickable) return msg.reply({embeds: [permissiondeniedem] }).catch(() => {return})
            amount = msg.content.split('1rmwarn <@!' + member.id + "> ")[1];
            amountisdefined = false
            if(amount!=undefined) {
                definedamount = amount;
                amountisdefined = true;
            }
            amount = msg.content.split('1rmwarn <@' + member.id + "> ")[1];
            if(amount!=undefined) {
                definedamount = amount;
                amountisdefined = true;
            }

            if(!amountisdefined) {
                const amountundefined = new MessageEmbed()
                .setColor("RED")
                .setTitle("**WARN**")
                .setDescription("**ERROR**: Amount has not been defined\n**USAGE**: 1rmwarn <USER> <AMOUNT>")
                return msg.reply({embeds: [amountundefined]}).catch(() => {return})
            }

            let data = fs.readFileSync("database.json", "utf8");
            let database = JSON.parse(data)
            var newvalue = "warns-" + msg.guild.id + "-" + member.id
            if(database[newvalue]==null||database[newvalue]==0) {
                const nowarns = new MessageEmbed()
                .setColor("RED")
                .setTitle("**WARN**")
                .setDescription("**ERROR**: User has no warns")
                return msg.reply({embeds: [nowarns]}).catch(() => {return})
            }
            if(database[newvalue]<definedamount) {
                const nowarns = new MessageEmbed()
                .setColor("RED")
                .setTitle("**WARN**")
                .setDescription("**ERROR**: You can't clear " + definedamount + " when user has only " + database[newvalue] + " warns")
                return msg.reply({embeds: [nowarns]}).catch(() => {return})
            }
            
            database[newvalue] = database[newvalue] - definedamount
            let databasejson = JSON.stringify(database)
            fs.writeFileSync("database.json", databasejson)
            const successrmwarn = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**WARN**")
            .setDescription("**SUCCESS**: Removed " + client.users.cache.get(member.id).username + "'s " + definedamount + " warn/s")
            return msg.reply({embeds: [successrmwarn]}).catch(() => {return})
        }

        if (msg.content.startsWith("1warn")) {
            args = msg.content.split(' ')
            reason = msg.content.split('1warn ' + args[1] + " ")[1];
            let member = msg.mentions.members.first();
            const mentionuserem = new MessageEmbed()
            .setColor("RED")
            .setTitle("**WARN**")
            .setDescription("**ERROR**: You need to mention user or invalid user!\n**USAGE**: 1warn @USER [REASON] (reason is not required)")
            const permissiondeniedem = new MessageEmbed()
            .setColor("RED")
            .setTitle("**WARN**")
            .setDescription("**ERROR**: Permission denied")
            if(!member) return msg.reply({ embeds: [mentionuserem] }).catch(() => {return})
            if(!member.kickable) return msg.reply({embeds: [permissiondeniedem] }).catch(() => {return})
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(!msgauthor.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                return msg.reply({ embeds: [permissiondeniedem] }).catch(() => {return})
            }
            if(reason==undefined) {
                reason = "None"
            }
            if(reason.startsWith("<@!")) {
                const invalidusageem = new MessageEmbed()
                .setColor("RED")
                .setTitle("**WARN**")
                .setDescription("**ERROR**: Invalid usage!\n**USAGE**: 1warn @USER [REASON] (reason is not required)")
                return msg.reply({ embeds: [invalidusageem] }).catch(() => {return});
            }
            if(member.user.bot) {
                const userisbot = new MessageEmbed()
                .setColor("RED")
                .setTitle("**WARN**")
                .setDescription("**ERROR**: You can't warn a bot")
                return msg.reply({ embeds: [userisbot] }).catch(() => {return});
            }
            let data = fs.readFileSync("database.json", "utf8");
            let database = JSON.parse(data)
            var newvalue = "warns-" + msg.guild.id + "-" + member.id
            if(database[newvalue]==null) {
                database[newvalue] = 0
            }
            database[newvalue]++
            let databasejson = JSON.stringify(database)
            fs.writeFileSync("database.json", databasejson)
            const warnuserembed = new MessageEmbed()
            .setColor("YELLOW")
            .setTitle("**WARN**")
            .setDescription("**Server**: " + msg.guild.name + "\n**Warn**: <@" + member + ">\n**Warned by**: <@" + msg.author + ">\n**Warns**: " + database[newvalue] + "\n**Reason**: " + reason)
            member.send({embeds: [warnuserembed]})
            const warnembed = new MessageEmbed()
            .setColor("YELLOW")
            .setTitle("**WARN**")
            .setDescription("**Warn**: <@" + member + ">\n**Warned by**: <@" + msg.author + ">\n**Warns**: " + database[newvalue] + "\n**Reason**: " + reason)
            msg.reply({ embeds: [warnembed] }).catch(() => {return})
        }

        if (msg.content.startsWith("1kick")) {
            reason = msg.content.split(' ');
            let member = msg.mentions.members.first();
            const mentionuserem = new MessageEmbed()
            .setColor("RED")
            .setTitle("**KICK**")
            .setDescription("**ERROR**: You need to mention user or invalid user!\n**USAGE**: 1kick @USER [REASON] (reason is not required)")
            const permissiondeniedem = new MessageEmbed()
            .setColor("RED")
            .setTitle("**KICK**")
            .setDescription("**ERROR**: Permission denied")
            if(!member) return msg.reply({ embeds: [mentionuserem] }).catch(() => {return})
            if(!member.kickable) return msg.reply({embeds: [permissiondeniedem] }).catch(() => {return})
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(!msgauthor.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
                return msg.reply({ embeds: [permissiondeniedem] }).catch(() => {return})
            }
            if(reason[2]==undefined) {
                reason[2] = "None"
            }
            if(reason[2].startsWith("<@!")) {
                let invalidusageem = new MessageEmbed()
                .setColor("RED")
                .setTitle("**BAN**")
                .setDescription("**ERROR**: Invalid usage!\n**USAGE**: 1kick @USER [REASON] (reason is not required)")
                return msg.reply({ embeds: [invalidusageem] }).catch(() => {return});
            }
            member.kick(reason[2]);
            let embed = new MessageEmbed()
            .setColor("YELLOW")
            .setTitle("**KICK**")
            .setDescription("**Kick**: <@" + member + ">\n**Kicked by**: <@" + msg.author + ">\n**Reason**: " + reason[2])
            msg.reply({ embeds: [embed] }).catch(() => {return})
        }

        if (msg.content.startsWith("1ban")) {
            reason = msg.content.split(' ');
            let member = msg.mentions.members.first();
            const mentionuserem = new MessageEmbed()
            .setColor("RED")
            .setTitle("**BAN**")
            .setDescription("**ERROR**: You need to mention user or invalid user!\n**USAGE**: 1ban @USER [REASON] (reason is not required)")
            const permissiondeniedem = new MessageEmbed()
            .setColor("RED")
            .setTitle("**BAN**")
            .setDescription("**ERROR**: Permission denied")
            if(!member) return msg.reply({embeds: [mentionuserem]}).catch(() => {return})
            if(!member.kickable) return msg.reply({embeds: [permissiondeniedem] }).catch(() => {return})
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(!msgauthor.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
                return msg.reply({ embeds: [permissiondeniedem] }).catch(() => {return})
            }
            if(reason[2]==undefined) {
                reason[2] = "None"
            }
            if(reason[2].startsWith("<@!")) {
                const invalidusageem = new MessageEmbed()
                .setColor("RED")
                .setTitle("**BAN**")
                .setDescription("**ERROR**: Invalid usage!\n**USAGE**: 1ban @USER [REASON] (reason is not required)")
                return msg.reply({ embeds: [invalidusageem] }).catch(() => {return});
            }
            const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle("**BAN**")
            .setDescription("**Ban**: <@" + member + ">\n**Banned by**: <@" + msg.author + ">\n**Reason**: " + reason[2])
            member.ban({reason: reason[2]});
            msg.reply({ embeds: [embed] }).catch(() => {return})
        }

        if (msg.content.startsWith("1pg")) {
            args = msg.content.split(' ');
            if (args[1]==undefined) {
                passwordsize = parseInt(8)
                randompass = randomString()
            } else {
                passwordsize = args[1]
            }
            if (isNaN(passwordsize)) {
                const nan = new MessageEmbed()
                .setColor("RED")
                .setTitle("**PASSWORD GENERATOR**")
                .setDescription("**ERROR**: Length must be a number (int)")
                return msg.reply({ embeds: [nan] }).catch(() => {return})
            }
            if (passwordsize>100) {
                const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle("**PASSWORD GENERATOR**")
                .setDescription("**ERROR**: Password can be long only up to 100 characters")
                .setFooter({text: "Do not give your password to others!"})
                return msg.reply({ embeds: [embed] }).catch(() => {return})
            }
            if (passwordsize<1) {
                let embed = new MessageEmbed()
                .setColor("RED")
                .setTitle("**PASSWORD GENERATOR**")
                .setDescription("**ERROR**: Password can't be 0 or negative number long")
                .setFooter({text: "Do not give your password to others!"})
                return msg.reply({ embeds: [embed] }).catch(() => {return})
            }
            randompass = randomString()
            try {
                let embed = new MessageEmbed()
                .setColor("GREEN")
                .setTitle("**PASSWORD GENERATOR**")
                .addField("**Random password**: ", randompass)
                .addField("**Length**: ", passwordsize.toString())
                .setFooter({text: "Do not give your password to others!"})
                msg.reply({ embeds: [embed] }).catch(() => {return})
            } catch (error) {
                console.log(error);
            }
        }

        if (msg.content.startsWith("1work")) {
            worknumber = randomnum(1, 11)
            switch(worknumber) {
                case 1:
                    work = "🎣Fisher🎣"
                    break
                case 2:
                    work = "👨‍🌾Farmer👩‍🌾"
                    break
                case 3:
                    work = "👩‍🏫Teacher👨‍🏫"
                    break
                case 4:
                    work = "👩‍🍳Chef👨‍🍳"
                    break
                case 5:
                    work = "👩‍✈️Pilot👨‍✈️"
                    break
                case 6:
                    work = "👮‍♀️Police👮‍♂️"
                    break
                case 7:
                    work = "⛏Miner⛏"
                    break
                case 8:
                    work = "👷‍♀️Construction Worker👷‍♂️"
                    break
                case 9:
                    work = "🏹Hunter🦌"
                    break
                case 10:
                    work = "👨‍🔧Mechanic👩‍🔧"
                    break
            }
            income = randomnum(100, 10000)
            gendernumber = randomnum(1, 3)
            if (gendernumber === 1) {
                gender = "Male"
            } else if (gendernumber === 2) {
                gender = "Female"
            }
            if (gender=="Female") {
                income = income - 200;
            }
            if (income<1) {
                income = incone + 200;
            }
            const workembed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**WORK**")
            .setDescription("**Your Work**: " + work + "\n**Your Income**: " + income + "$\n** Your Gender**: " + gender)
            return msg.reply({ embeds: [workembed] }).catch(() => {return})
        }

        if (msg.content.startsWith("1gay")) {
            gaymember = msg.content.split("1gay ")[1];
            let mumber = msg.mentions.members.first();
            if(gaymember==undefined) {
                member = msg.author
            } else {
                if(!mumber) {
                    const gaytesterrorembed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("**🦄 GAY TEST 🦄**")
                    .setDescription("**ERROR**: You need to mention a valid user!")
                    return msg.reply({embeds: [gaytesterrorembed]}).catch(() => {return})
                }
                member = client.users.cache.get(mumber.id)
            }
            let percentgay = randomnum(1, 101);
            let gaystatus;
            // ↓ Gay statuses
            gaybreak: {
                if(percentgay<20) {
                    gaystatus = "isn't gay.";
                    break gaybreak;
                } else if(percentgay<50) {
                    gaystatus = "is little interested in males.";
                    break gaybreak;
                } else if(percentgay<80) {
                    gaystatus = "maybe is gay.";
                    break gaybreak;
                } else if(percentgay<=100) {
                    gaystatus = "is gay.";
                    break gaybreak;
                }
            }
            const gaytestembed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**🦄 GAY TEST 🦄**")
            .setDescription(member.username + "'s Gay Test: " + percentgay + "/100%\n" + member.username + " " + gaystatus);
            if(member.bot) {
                gaytestembed.setFooter({text: "But bot cannot be GAY, I guess so"});
            }
            msg.reply({embeds: [gaytestembed]}).catch(() => {return});
        }

        if (msg.content.startsWith("1lesbian")) {
            lesbianmember = msg.content.split("1lesbian ")[1];
            let mumber = msg.mentions.members.first();
            if(lesbianmember==undefined) {
                member = msg.author;
            } else {
                if(!mumber) {
                    const lesbiantesterrorembed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("**🦄 LESBIAN TEST 🦄**")
                    .setDescription("**ERROR**: You need to mention a valid user!")
                    return msg.reply({embeds: [lesbiantesterrorembed]}).catch(() => {return})
                }
                member = client.users.cache.get(mumber.id)
            }
            let percentlesbian = randomnum(1, 101);
            let lesbianstatus;
            // ↓ Lesbian statuses
            lesbianbreak: {
                if(percentlesbian<20) {
                    lesbianstatus = "isn't lesbian.";
                    break lesbianbreak;
                } else if(percentlesbian<50) {
                    lesbianstatus = "is little interested in females.";
                    break lesbianbreak;
                } else if(percentlesbian<80) {
                    lesbianstatus = "maybe is lesbian.";
                    break lesbianbreak;
                } else if(percentlesbian<=100) {
                    lesbianstatus = "is lesbian.";
                    break lesbianbreak;
                }
            }
            const gaytestembed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**🦄 LESBIAN TEST 🦄**")
            .setDescription(member.username + "'s Lesbian Test: " + percentlesbian + "/100%\n" + member.username + " " + lesbianstatus);
            if(member.bot) {
                gaytestembed.setFooter({text: "But bot cannot be LESBIAN, I guess so"});
            }
            msg.reply({embeds: [gaytestembed]}).catch(() => {return});
        }

        if (msg.content.startsWith("1calc")) {
            let args = msg.content.split(' ');
            let allarguments = msg.content.split("1calc ")[1];
            if(allarguments==undefined) {
                let undefinedallarguments = new MessageEmbed()
                .setColor("RED")
                .setTitle("CALCULATOR")
                .setDescription("**USAGE**: 1calc <Number 1> <Operator> <Number 2>");
                return msg.reply({embeds: [undefinedallarguments]}).catch(() => {return})
            }
            number1 = parseInt(args[1]);
            operator = args[2];
            number2 = parseInt(args[3]);
            const undefinedargument = new MessageEmbed()
                .setColor("RED")
                .setTitle("CALCULATOR")
                .setDescription("**ERROR**: Undefined arguments\n**USAGE**: 1calc <Number 1> <Operator> <Number 2>")
            if(args[1]==undefined) {
                return msg.reply({embeds: [undefinedargument]}).catch(() => {return});
            } else if(args[2]==undefined) {
                return msg.reply({embeds: [undefinedargument]}).catch(() => {return});
            } else if(args[3]==undefined) {
                return msg.reply({embeds: [undefinedargument]}).catch(() => {return});
            }
            checknumber1 = args[1].toString();
            checknumber2 = args[3].toString();
            if(checknumber1.includes(".") || checknumber1.includes(",")) {
                const cantsolvefloat = new MessageEmbed()
                .setColor("RED")
                .setTitle("CALCULATOR")
                .setDescription("**ERROR**: Float numbers can't solve now");
                return msg.reply({embeds: [cantsolvefloat]}).catch(() => {return});
            } else if(checknumber2.includes(".") || checknumber2.includes(",")) {
                const cantsolvefloat = new MessageEmbed()
                .setColor("RED")
                .setTitle("CALCULATOR")
                .setDescription("**ERROR**: Float numbers can't solve now");
                return msg.reply({embeds: [cantsolvefloat]}).catch(() => {return});
            }
            result = calculator(number1, operator, number2)
            if(result == "wrong-syntax") {
                return msg.reply("wrong syntax error in 1calc (executed by " + msg.author.tag + ")").catch(() => {return})
            } else if(result == "invalidop") {
                const invalidoperator = new MessageEmbed()
                .setColor("RED")
                .setTitle("CALCULATOR")
                .setDescription("**ERROR**: Invalid operator\n**Valid operators are**: +, -, *, /")
                return msg.reply({embeds: [invalidoperator]}).catch(() => {return})
            } else if(result == "wrongnumber") {
                const wrongnumber = new MessageEmbed()
                .setColor("RED")
                .setTitle("CALCULATOR")
                .setDescription("**ERROR**: Syntax error\n**USAGE**: 1calc <Number 1> <Operator> <Number 2>")
                return msg.reply({embeds: [wrongnumber]}).catch(() => {return})
            }
            const resultembed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**CALCULATOR**")
            .setDescription("**Result is**: " + result.toString())
            msg.reply({embeds: [resultembed]}).catch(() => {return})
        }

        if (msg.content.startsWith("1poll")) {
            arguments = msg.content.split("1poll ")[1]
            if (arguments==undefined) {
                const usage = new MessageEmbed()
                .setColor("RED")
                .setTitle("**POLL**")
                .setDescription("**USAGE**: 1poll <MESSAGE>")
                return msg.reply({ embeds: [usage] }).catch(() => {return})
            }
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if (arguments.includes("@everyone")) {
                if (!msgauthor.permissions.has(Permissions.FLAGS.MENTION_EVERYONE)) {
                    const everyoneerror = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("**POLL**")
                    .setDescription("**ERROR**: You do not have permission to mention everyone!")
                    return msg.reply({ embeds: [everyoneerror] }).catch(() => {return})
                }
            } else if (arguments.includes("@here")) {
                if (!msgauthor.permissions.has(Permissions.FLAGS.MENTION_EVERYONE)) {
                    const everyoneerror = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("**POLL**")
                    .setDescription("**ERROR**: You do not have permission to mention everyone!")
                    return msg.reply({ embeds: [everyoneerror] }).catch(() => {return})
                }
            }
            const poll = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**POLL**")
            .setDescription(arguments)
            try {
                const msgedit = await msg.channel.messages.fetch(msg.id);
                msgedit.delete()
                .catch((err) => {
                    return
                });
            } catch(error) {
                msg.reply("Failed to delete command message! " + error).catch(() => {return})
            }
            const pollmsg = await msg.channel.send({ embeds: [poll] }).catch(() => {return})
            pollmsg.react("✅")
            pollmsg.react("❎")
        }

        if (msg.content.startsWith("1stonks")) {
            arguments = msg.content.split("1stonks ")[1]
            args = msg.content.split(' ')
            if (args[1]==undefined) {
                const stonksembed = new MessageEmbed()
                .setColor("GREEN")
                .setTitle("**STONKS**")
                .setImage("https://vacefron.nl/api/stonks?user=" + msg.author.displayAvatarURL() + "?size=4096")
                axios.get("https://vacefron.nl/api/stonks?user=" + msg.author.displayAvatarURL() + "?size=4096").then(res => {
                    let stonksres = res.data.toString();
                    if (!stonksres.includes("�") && debug) console.log("API response: " + res.data.toString());
                }).catch(() => {
                    let stonksapidown = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("**STONKS**")
                    .setDescription("**ERROR**: Stonks API is not responding.");
                    return msg.reply({embeds: [stonksapidown]});
                })
                return msg.reply({ embeds: [stonksembed] }).catch(() => {
                    console.log("\033[0;33m==> [DEBUG] Handled Error: Unknown error\033[0m");
                    return;
                })
            }
            let mumber = msg.mentions.members.first();
            if (!mumber) {
                const stonksembed = new MessageEmbed()
                .setColor("RED")
                .setTitle("**STONKS**")
                .setDescription("**ERROR**: You need to mention someone or invalid user!")
                return msg.reply({ embeds: [stonksembed] }).catch(() => {return})
            }
            let member = client.users.fetch(mumber.id)
            member.then(function(memberget) {
                imageurl = memberget.displayAvatarURL();
                const stonksembed = new MessageEmbed()
                .setColor("GREEN")
                .setTitle("**STONKS**")
                .setImage("https://vacefron.nl/api/stonks?user=" + imageurl + "?size=4096")
                msg.reply({ embeds: [stonksembed] }).catch(() => {return})
            })
        }

        if (msg.content.startsWith("1avatar")) {
            arguments = msg.content.split("1stonks ")[1]
            let mumber = msg.mentions.members.first();
            if (!mumber) {
                const avatarinvalid = new MessageEmbed()
                .setColor("RED")
                .setTitle("**AVATAR**")
                .setDescription("**ERROR**: You need to mention someone or invalid user!")
                return msg.reply({ embeds: [avatarinvalid] }).catch(() => {return})
            }
            let member = client.users.fetch(mumber.id)
            member.then(function(memberget) {
                imageurl = memberget.displayAvatarURL();
                msg.reply(imageurl).catch(() => {return});
            }).catch(() => {
                console.log("\033[0;33m==> [DEBUG] Handled Error: Cannot fetch user's avatar\033[0m");
                return;
            })
        }

        if (msg.content === "1cat") {
            if(usereplit) {
                return msg.reply({embeds: [replitnekoerr]}).catch(() => {return})
            }
            let apiworks = true;
            cat = await neko.sfw.meow().catch(() => {
                return apiworks = false;
            });
            if(!apiworks) {
                let animalapierr = new MessageEmbed()
                .setColor("RED")
                .setTitle("**CAT**")
                .setDescription("**ERROR**: API Error (nekos.life API)");
                return msg.reply({embeds: [animalapierr]}).catch(() => {return});
            };
            const catembed = new MessageEmbed()
            .setColor("ORANGE")
            .setTitle("**CAT**")
            .setDescription("Some cat for you")
            .setImage(cat.url);
            msg.reply({ embeds: [catembed] }).catch(() => {return});
        }

        if (msg.content === "1dog") {
            if(usereplit) {
                return msg.reply({embeds: [replitnekoerr]}).catch(() => {return})
            }
            let apiworks = true;
            dog = await neko.sfw.woof().catch(() => {
                return apiworks = false;
            });
            if(!apiworks) {
                let animalapierr = new MessageEmbed()
                .setColor("RED")
                .setTitle("**DOG**")
                .setDescription("**ERROR**: API Error (nekos.life API)");
                return msg.reply({embeds: [animalapierr]}).catch(() => {return});
            };
            const dogembed = new MessageEmbed()
            .setColor("ORANGE")
            .setTitle("**DOG**")
            .setDescription("Some dog for you")
            .setImage(dog.url);
            msg.reply({ embeds: [dogembed] }).catch(() => {return});
        }

        if (msg.content === "1goose") {
            if(usereplit) {
                return msg.reply({embeds: [replitnekoerr]}).catch(() => {return})
            }
            let apiworks = true;
            goose = await neko.sfw.goose().catch(() => {
                return apiworks = false;
            });
            if(!apiworks) {
                let animalapierr = new MessageEmbed()
                .setColor("RED")
                .setTitle("**GOOSE**")
                .setDescription("**ERROR**: API Error (nekos.life API)");
                return msg.reply({embeds: [animalapierr]}).catch(() => {return});
            };
            const gooseembed = new MessageEmbed()
            .setColor("ORANGE")
            .setTitle("**GOOSE**")
            .setDescription("Some goose for you")
            .setImage(goose.url);
            msg.reply({ embeds: [gooseembed] }).catch(() => {return});
        }

        if (msg.content === "1lizard") {
            if(usereplit) {
                return msg.reply({embeds: [replitnekoerr]}).catch(() => {return})
            }
            let apiworks = true;
            lizard = await neko.sfw.lizard().catch(() => {
                return apiworks = false;
            });
            if(!apiworks) {
                let animalapierr = new MessageEmbed()
                .setColor("RED")
                .setTitle("**LIZARD**")
                .setDescription("**ERROR**: API Error (nekos.life API)");
                return msg.reply({embeds: [animalapierr]}).catch(() => {return});
            };
            const lizardembed = new MessageEmbed()
            .setColor("ORANGE")
            .setTitle("**LIZARD**")
            .setDescription("Some lizard for you")
            .setImage(lizard.url);
            msg.reply({ embeds: [lizardembed] }).catch(() => {return});
        }

        if (msg.content === "1tpdne") {
            https.get("https://fakeface.rest/face/json",(res) => {
                let body = "";
            
                res.on("data", (chunk) => {
                    body += chunk;
                });
            
                res.on("end", () => {
                    try {
                        let json = JSON.parse(body);
                        const tpdne = new MessageEmbed()
                        .setColor("GREEN")
                        .setTitle("**THIS PERSON DOES NOT EXIST**")
                        .setDescription("These images generates AI from fakeface.rest API")
                        .setImage(json.image_url)
                        msg.reply({embeds: [tpdne]}).catch(() => {return})
                    } catch (error) {
                        console.error(error.message);
                    };
                });
            
            }).on("error", (error) => {
                console.error(error.message);
            });
        }

        if (msg.content === "1animeavatar") {
            if(usereplit) {
                return msg.reply({embeds: [replitnekoerr]}).catch(() => {return})
            }
            let apiworks;
            animeavatar = await neko.sfw.avatar().catch(() => {
                return apiworks = false;
            });
            if(!apiworks) {
                let nekoapierr = new MessageEmbed()
                .setColor("RED")
                .setTitle("**CAT**")
                .setDescription("**ERROR**: API Error (nekos.life API)");
                return msg.reply({embeds: [nekoapierr]}).catch(() => {return});
            };
            const animeavatarembed = new MessageEmbed()
            .setColor("ORANGE")
            .setTitle("**Anime Avatar**")
            .setDescription("Some avatar for you")
            .setImage(animeavatar.url);
            msg.reply({ embeds: [animeavatarembed] }).catch(() => {return});
        }
    } catch(error) {
        console.log("==> ERROR: " + error);
        return;
    }

    if (msg.content === "1nordvpn") {
        if (!nordenabled) {
            return;
        }
        const generatingnordaccem = new MessageEmbed()
        .setColor("YELLOW")
        .setTitle("NordVPN")
        .setDescription("Generating NordVPN account..");
        let generatingmsg = await msg.channel.send({embeds: [generatingnordaccem]}).catch(() => {return});
        setTimeout(() => {
            https.get("https://tomkoid.tk/nordvpn/nordvpnlist.txt",(res) => {
                let body = "";
            
                res.on("data", (chunk) => {
                    body += chunk;
                });
            
                res.on("end", () => {
                    try {
                        https.get("https://tomkoid.tk/nordvpn/nordvpninfo.txt",(res) => {
                            let infobody = "";
                            res.on("data", (chunk) => {
                                infobody += chunk;
                            });

                            res.on("end", () => {
                                try {
                                    numberofnordaccounts = infobody.toString().split(":")[1];
                                    lastnordaccupdate = infobody.toString().split(":")[0];
                                    generatingmsg.delete(1000).catch(() => {
                                        if (config.ENABLE_DEBUG) {
                                            console.log("\033[0;33m==> [DEBUG] Handled Error: Message can't be deleted, because it does not exist\033[0m");
                                        }
                                        return;
                                    })
                                    let nordjson = JSON.parse(body);
                                    let loop = true;
                                    while(loop==true) {
                                        nordrandnum = randomnum(0, parseInt(numberofnordaccounts) + 1);
                                        if(nordjson[nordrandnum]==undefined) {
                                            continue;
                                        } else {
                                            break;
                                        }
                                    }
                                    if(debug) console.log("Phyc account ID generated: " + nordrandnum.toString());
                                    let nordacc = nordjson[nordrandnum];
                                    if(nordacc==undefined) {
                                        const nordnetworkerr = new MessageEmbed()
                                        .setColor("RED")
                                        .setTitle("NordVPN")
                                        .setDescription("**ERROR**: Failed to get data from web server");
                                        return msg.reply({embeds: [nordnetworkerr]}).catch(() => {return});
                                    }
                                    const nordembed = new MessageEmbed()
                                    .setColor("GREEN")
                                    .setTitle("NordVPN")
                                    .addField("**Email**", nordacc.split(":")[0])
                                    .addField("**Password**", nordacc.split(":")[1]);
                                    if(nordacc.split(":")[2]!=undefined) {
                                        nordembed.addField("**Expires**", nordacc.split(":")[2])
                                    }
                                    nordembed.addField("**Phyc Account ID**", nordrandnum.toString());
                                    nordembed.addField("**Info**", "This command isn't illegal. Accounts are from people, who want to share their account with others.");
                                    nordembed.setFooter({text: "Last update from " + lastnordaccupdate});
                                    msg.reply({embeds: [nordembed]}).catch(() => {return});
                                } catch(err) {
                                    console.log("ERROR when loading nordvpn info: ", err.message)
                                }
                            })
                        });
                    } catch (error) {
                        console.error(error.message);
                    };
                });
            
            }).on("error", (error) => {
                console.error(error.message);
            });
          }, 2000);
    }

    if (msg.content.startsWith("1nordvpnreport")) {
        args = msg.content.split(" ");
        let blacklistdata = fs.readFileSync("database.json", "utf8");
        let blacklistjson = JSON.parse(blacklistdata);
        let blacklistloc = "blacklist-" + msg.author.id;
        if(blacklistjson[blacklistloc]==true) {
            const phycnordblacklist = new MessageEmbed()
            .setColor("BLACK")
            .setTitle("**NordVPN Report**")
            .setDescription("**ERROR:** You are in blacklist.");
            return msg.reply({embeds: [phycnordblacklist]}).catch(() => {return});
        }
        if(isNaN(args[1])) {
            const phycnordidnan = new MessageEmbed()
            .setColor("RED")
            .setTitle("**NordVPN Report**")
            .setDescription("**ERROR:** Defined ID is not a number");
            return msg.reply({embeds: [phycnordidnan]}).catch(() => {return});
        }
        let phycnordid = args[1];
        let owneruser = await client.users.fetch(config.BOTOWNERID);
        let ownermsg = client.users.cache.get(owneruser.id);
        if (ownermsg==undefined) {
            return msg.reply("**ERROR:** Bot owner is not in any mutual servers or it didn't found bot owner.").catch(() => {return})
        }
        if (phycnordid>numberofnordaccounts) {
            const phycnordreporterrornumber = new MessageEmbed()
            .setColor("RED")
            .setTitle("**NORDVPN REPORT**")
            .setDescription("**ERROR:** You specified id #" + phycnordid + ", but there are only " + numberofnordaccounts + " accounts.");
            return msg.reply({embeds: [phycnordreporterrornumber]}).catch(() => {return});
        }
        if (phycnordid<0) {
            const phycnordreporterrorinnumber = new MessageEmbed()
            .setColor("RED")
            .setTitle("**NORDVPN REPORT**")
            .setDescription("**ERROR:** ID can't be lower than zero.");
            return msg.reply({embeds: [phycnordreporterrorinnumber]});
        }
        const phycnordreport = new MessageEmbed()
        .setColor("RED")
        .setTitle("**NORDVPN REPORT**")
        .setDescription(msg.author.tag + " (" + msg.author.id + ") reported, that NordVPN account number #" + phycnordid + " doesn't work.")
        ownermsg.send({embeds: [phycnordreport]}).catch(() => {
            const phycnordreporterror = new MessageEmbed()
            .setColor("RED")
            .setTitle("**NORDVPN REPORT**")
            .setDescription("**ERROR:** Bot owner is not in any mutual servers or it didn't found bot owner.");
            return msg.reply({embeds: [phycnordreporterror]}).catch(() => {return});
        });
        const phycnordreportsuccess = new MessageEmbed()
        .setColor("GREEN")
        .setTitle("**NORDVPN REPORT**")
        .setDescription("**SUCCESS:** Reported NordVPN account.");
        return msg.reply({embeds: [phycnordreportsuccess]}).catch(() => {return});
    }

    if (msg.content.startsWith("1blacklist")) {
        args = msg.content.split(" ");
        if(msg.author.id!=botownerid) {
            const blacklistpermission = new MessageEmbed()
            .setColor("RED")
            .setTitle("**BLACKLIST**")
            .setDescription("**ERROR:** You don't have permissions to manage blacklist");
            return msg.reply({embeds: [blacklistpermission]}).catch(() => {return});
        }
        switch(args[1]) {
            case "add":
                if (args[2]==undefined) {
                    const blacklistunspecified2 = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("**BLACKLIST**")
                    .setDescription("**ERROR:** User not specified.\n**USAGE**: 1blacklist <add/rm> <user ID>");
                    return msg.reply({embeds: [blacklistunspecified2]}).catch(() => {return});
                }
                if (isNaN(args[2])) {
                    const blacklistusernan = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("**BLACKLIST**")
                    .setDescription("**ERROR:** User ID is not in numbers.\n**USAGE**: 1blacklist <add/rm> <user ID>");
                    return msg.reply({embeds: [blacklistusernan]}).catch(() => {return});
                }
                let databasedata = fs.readFileSync("database.json", "utf8");
                let database = JSON.parse(databasedata)
                let databaseloc = "blacklist-" + args[2];
                database[databaseloc] = true;
                let databasejson = JSON.stringify(database)
                fs.writeFileSync("database.json", databasejson)
                const blacklistusersuccess = new MessageEmbed()
                .setColor("GREEN")
                .setTitle("**BLACKLIST**")
                .setDescription("**SUCCESS:** User added on blacklist.");
                msg.reply({embeds: [blacklistusersuccess]}).catch(() => {return});
                break;
            case "rm":
                if (args[2]==undefined) {
                    const blacklistunspecified2 = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("**BLACKLIST**")
                    .setDescription("**ERROR:** User not specified.\n**USAGE**: 1blacklist <add/rm> <user ID>");
                    return msg.reply({embeds: [blacklistunspecified2]}).catch(() => {return});
                }
                if (isNaN(args[2])) {
                    const blacklistusernan = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("**BLACKLIST**")
                    .setDescription("**ERROR:** User ID is not in numbers.\n**USAGE**: 1blacklist <add/rm> <user ID>");
                    return msg.reply({embeds: [blacklistusernan]}).catch(() => {return});
                }
                let databasermdata = fs.readFileSync("database.json", "utf8");
                let databaserm = JSON.parse(databasermdata)
                let databasermloc = "blacklist-" + args[2];
                if (databaserm[databasermloc]==null||databaserm[databasermloc]==false) {
                    const blacklistusernotexist = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("**BLACKLIST**")
                    .setDescription("**ERROR:** User is not in blacklist.");
                    return msg.reply({embeds: [blacklistusernotexist]}).catch(() => {return});
                }
                databaserm[databasermloc] = false;
                let databasermjson = JSON.stringify(databaserm)
                fs.writeFileSync("database.json", databasermjson)
                const blacklistrmusersuccess = new MessageEmbed()
                .setColor("GREEN")
                .setTitle("**BLACKLIST**")
                .setDescription("**SUCCESS:** User removed from blacklist.");
                msg.reply({embeds: [blacklistrmusersuccess]}).catch(() => {return});
                break;
            default:
                const blacklistunspecified = new MessageEmbed()
                .setColor("RED")
                .setTitle("**BLACKLIST**")
                .setDescription("**ERROR:** Action not specified.\n**USAGE**: 1blacklist <add/rm> <user ID>");
                return msg.reply({embeds: [blacklistunspecified]}).catch(() => {return});
        }
    }

    if(msg.content.startsWith("1reverse")) {
        args = msg.content.split("1reverse ")[1]
        if(args==undefined) {
            const reverseunerr = new MessageEmbed()
            .setColor("RED")
            .setTitle("**REVERSE**")
            .setDescription("**USAGE**: 1reverse <word>");
            return msg.reply({embeds: [reverseunerr]}).catch(() => {return});
        }
        let reversedtmp = args.split('').reverse().toString();
        reversed = reversedtmp.replaceAll("\n", "").replaceAll(",", "");
        const reversedem = new MessageEmbed()
        .setColor("RED")
        .setTitle("**REVERSE**")
        .addField("Reversed", reversed)
        .setFooter({text: "USAGE: 1reverse <word>"});
        return msg.reply({embeds: [reversedem]}).catch(() => {return});
    }

    if(msg.content.startsWith("1ball")) {
        if(msg.content.split("1ball ")[1] == undefined) {
            let ballun = new MessageEmbed()
            .setColor("RED")
            .setTitle("**8BALL**")
            .setDescription("**USAGE**: 1ball <question>")
            return msg.reply({embeds: [ballun]}).catch(() => {return})
        }
        let answers = ["Yes.", "No.", "I don't think so.", "Maybe.", "Hmmmm..", "I guess.", "Yes, but no.", "No, but yes."];
        let ballembed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle("**8BALL**")
        .addField("Question", "**" + msg.content.split("1ball ")[1] + "**")
        .addField("Answer", answers[randomnum(0, 8)]);
        return msg.reply({embeds: [ballembed]}).catch(() => {return});
    }

    if(msg.content.startsWith("1owoify")) {
        if(usereplit) {
            return msg.reply({embeds: [replitnekoerr]}).catch(() => {return})
        }
        if(msg.content.split("1owoify ")[1] == undefined) {
            let owoun = new MessageEmbed()
            .setColor("RED")
            .setTitle("**OWOIFY**")
            .setDescription("**USAGE**: 1owoify <text>");
            return msg.reply({embeds: [owoun]}).catch(() => {return});
        }
        let apiworks = true;
        let owoifiedtext = await neko.sfw.OwOify({text: msg.content.split("1owoify ")[1]}).catch(() => {
            return apiworks = false;
        });
        if(!apiworks) {
            let owoapierr = new MessageEmbed()
            .setColor("RED")
            .setTitle("**OWOIFY**")
            .setDescription("**ERROR**: API Error (nekos.life API)");
            return msg.reply({embeds: [owoapierr]}).catch(() => {return});
        }
        let owoified = new MessageEmbed()
        .setColor("GREEN")
        .setTitle("**OWOIFY**")
        .addField("OwOified text", "**" + owoifiedtext.owo + "**");
        return msg.reply({embeds: [owoified]}).catch(() => {return});
    }

    if(msg.content.startsWith("1github")) {
        let args = msg.content.split(" ");
        if(args[1]==undefined) {
            let githubun = new MessageEmbed()
            .setColor("RED")
            .setTitle("**GITHUB**")
            .setDescription("**USAGE**: 1github <username>");
            return msg.reply({embeds: [githubun]}).catch(() => {return});
        }
        axios.get("https://api.github.com/users/" + args[1]).then(res => {
            let gitdata = JSON.stringify(res.data);
            let gitr = JSON.parse(gitdata);
            if(gitr.message=='Not Found') {
                let githubnotf = new MessageEmbed()
                .setColor("RED")
                .setTitle("**GITHUB**")
                .setDescription("**ERROR**: User not found.");
                return msg.reply({embeds: [githubnotf]}).catch(() => {return});
            }
            let githubstatus = new MessageEmbed()
            githubstatus.setColor("GREEN");
            githubstatus.setTitle("**GITHUB**");
            githubstatus.addField("Nickname", gitr.login);
            if(gitr.name!=null) {
                githubstatus.addField("Name", gitr.name);
            }
            if(gitr.twitter_username!=null) {
                githubstatus.addField("Twitter Username", gitr.twitter_username);
            }
            githubstatus.addField("Type", gitr.type);
            if(gitr.blog!==null && gitr.blog.toString()!=="") {
                githubstatus.addField("Blog", gitr.blog);
            }
            if(gitr.email!=null) {
                githubstatus.addField("Email", gitr.email);
            }
            if(gitr.bio!=null) {
                githubstatus.addField("Bio", gitr.bio);
            }
            if(gitr.followers!=null) {
                githubstatus.addField("Followers", gitr.followers.toString());
            }
            if(gitr.following!=null) {
                githubstatus.addField("Following", gitr.following.toString());
            }
            githubstatus.addField("Public Repos", gitr.public_repos.toString());
            if(gitr.public_gists!=null) {
                githubstatus.addField("Public Gists", gitr.public_gists.toString());
            }
            if(gitr.id!=null) {
                githubstatus.addField("GitHub ID", gitr.id.toString());
            }
            return msg.reply({embeds: [githubstatus]}).catch(() => {return});
        }).catch(err => {
            let githubnotf = new MessageEmbed()
            .setColor("RED")
            .setTitle("**GITHUB**")
            .setDescription("**ERROR**: User not found.");
            if(debug) {
                console.log(err);
            }
            return msg.reply({embeds: [githubnotf]}).catch(() => {return});
        });

    }

    /*if(msg.content.startsWith("1nick")) {
        let member = msg.guild.members.cache.get(msg.author.id);
        member.setNickname("Nickname").catch(() => {
            msg.reply("I can't do that").catch(() => {return});
        });
        msg.reply("THIS COMMAND IS NOT WORKING NOW").catch(() => {return});
    }*/

})

if (config.ENABLE_DEBUG) {
    console.log("\033[0;33m[DEBUG] Logs: Checking config..\033[0m");
}

if(TOKEN=="YOUR_TOKEN") {
    return console.log("\033[0;33mYou must set your bot's token in config.json\033[0m")
}

if(showsysinfo) {
    console.log("System         | " + os.platform().toUpperCase());
    console.log("System Release | " + os.release());
    console.log("Average Load   | " + os.loadavg()[0] + "%");
    console.log("CPU Arch       | " + os.arch());
    console.log("Total Memory   | " + formatBytes(os.totalmem()));
    console.log("Free Memory    | " + formatBytes(os.freemem()));
}

if(showlogintoken) console.log("---------------------------------------------------------------------------");
if(!showlogintoken) console.log("----------------------------------");

console.log("\033[0;33m==> [" + botname + "] Running on version " + version + ".\033[0m");

if(!config.DISABLE_TIPS) {
    if(logmessages) {
        if(!logmessagesminsyntax) console.log("\033[0;33m==> [TIP] Replit has small console. Try to enable LOG_MESSAGES_MINIMAL_SYNTAX.\033[0m");
    }
}

if(showlogintoken) {
    if(config.CHECK_FOR_UPDATES) checkforupdates();
    console.log("\033[0;33m==> [" + botname + "] Logging in as " + TOKEN + "..\033[0m");
} else {
    if(config.CHECK_FOR_UPDATES) checkforupdates();
    console.log("\033[0;33m==> [" + botname + "] Logging in..\033[0m");
}

client.login(TOKEN).catch((err) => {
    console.log("\033[0;31m----------------------------------\033[0m");
    console.log(err);
    console.log("\033[0;31m----------------------------------\033[0m");
    if(err.toString().includes('TOKEN_INVALID')) console.log("\033[0;31mCan't login to TOKEN, because the TOKEN is invalid.\033[0m");
    if(err.toString().includes('reason: getaddrinfo EAI_AGAIN discord.com')) console.log("\033[0;31mIs your internet working?\033[0m");
    console.log("\033[0;31m[" + botname + "]: Login Failed (the reason is above)\033[0m");
    phycexit(1);
});