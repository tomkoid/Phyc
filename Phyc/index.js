const { Client, Intents, MessageEmbed, Permissions } = require("discord.js")
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] })
const Crypto = require('crypto')
const { stdout } = require("process")
const nekosapi = require('nekos.life')
const neko = new nekosapi();
const fs = require("fs");
const fetch = require('node-fetch');

const botname = "Phyc"
const botownerid = "422944426206167052";

function randomString(size = parseInt(passwordsize)) {  
    return Crypto
      .randomBytes(size = parseInt(passwordsize))
      .toString('base64')
      .slice(0, size)
  }

  function randomnum(min, max) {  
    return Math.floor(
      Math.random() * (max - min) + min
    )
  }

function calculator(number1, operator, number2) {
    if(isNaN(number1)) {
        return "wrongnumber"
    } else if(isNaN(number2)) {
        return "wrongnumber"
    }
    switch(operator) {
        case "+":
            returnednumber = number1 + number2
            break
        case "-":
            returnednumber = number1 - number2
            break
        case "*":
            returnednumber = number1 * number2
            break
        case "/":
            returnednumber = number1 / number2
            break
        default:
            returnednumber = "invalidop"
    }
    return returnednumber
}

function msglog(cur) {
    if(cur=="servers") {
        stdout.write(authormessage + " used 1servers command\n")
    } else if(cur=="kick") {
        stdout.write(authormessage + " used 1kick command\n")
    } else if(cur=="ban") {
        stdout.write(authormessage + " used 1ban command\n")
    } else if(cur=="refreshstatus") {
        stdout.write(authormessage + " used 1refreshstatus command\n")
    } else if(cur=="pg") {
        stdout.write(authormessage + " used 1pg command\n")
    } else if(cur=="meme") {
        stdout.write(authormessage + " used 1meme command\n")
    } else if(cur=="poll") {
        stdout.write(authormessage + " used 1poll command\n")
    } else if(cur=="uptime") {
        stdout.write(authormessage + " used 1uptime command\n")
    } else if(cur=="help") {
        stdout.write(authormessage + " used 1help command\n")
    } else if(cur=="clear") {
        stdout.write(authormessage + " used 1clear command\n")
    } else if(cur=="stonks") {
        stdout.write(authormessage + " used 1stonks command\n")
    } else if(cur=="work") {
        stdout.write(authormessage + " used 1work command\n")
    } else if(cur=="avatar") {
        stdout.write(authormessage + " used 1avatar command\n")
    } else if(cur=="cat") {
        stdout.write(authormessage + " used 1cat command\n")
    } else if(cur=="wallpaper") {
        stdout.write(authormessage + " used 1wallpaper command\n")
    } else if(cur=="animeavatar") {
        stdout.write(authormessage + " used 1animeavatar command\n")
    } else if(cur=="forceleave") {
        stdout.write(authormessage + " used 1forceleave command\n")
    }
}

imageurl = "none"

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
    discordstatus = "Phyc RC | 1help"
    client.user.setActivity(discordstatus);
})

client.on("messageCreate", async msg => {
    authormessage = msg.author.tag
    
    // Check if sended message is not bot's
    if (msg.author == client.user) {
        return
    }

    // Permissions
    if(!msg.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) {
        return
    }

    if(!msg.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES_IN_THREADS)) {
        return
    }
    if (msg.content == "1perms") {
        if(!msg.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            return msg.channel.send("**ERROR**: The bot has not permission to manage messages.")
        }
    
        if(!msg.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)) {
            return msg.channel.send("**ERROR**: The bot has not permission to embed links.")
        }
    
        if(!msg.guild.me.permissions.has(Permissions.FLAGS.ATTACH_FILES)) {
            return msg.channel.send("**ERROR**: The bot has not permission to attach files.")
        }
    
        if(!msg.guild.me.permissionsIn(msg.channel.id).has(Permissions.FLAGS.EMBED_LINKS)) {
            return msg.channel.send("**ERROR**: The bot has not permission to embed links in this channel.")
        }
    
        if(!msg.guild.me.permissionsIn(msg.channel.id).has(Permissions.FLAGS.ATTACH_FILES)) {
            return msg.channel.send("**ERROR**: The bot has not permission to attach files in this channel.")
        }
        const problemnotfound = new MessageEmbed()
        .setColor("GREEN")
        .setTitle("**PERMS**")
        .setDescription("**SUCCESS**: No problem in perms found")
        msg.channel.send({embeds: [problemnotfound] })
    }
    if(!msg.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
        return
    }

    if(!msg.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)) {
        return
    }

    if(!msg.guild.me.permissions.has(Permissions.FLAGS.ATTACH_FILES)) {
        return
    }

    if(!msg.guild.me.permissionsIn(msg.channel.id).has(Permissions.FLAGS.EMBED_LINKS)) {
        return
    }

    if(!msg.guild.me.permissionsIn(msg.channel.id).has(Permissions.FLAGS.ATTACH_FILES)) {
        return
    }
    
    try {
        if (msg.content == "<@!921498042253852682>") {
            if (msg.author === client.user) {
                return
            }
            const phycembed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("PHYC")
            .setDescription(`**You can use 1help to see all commands!**`)
            .setFooter("Executed by " + msg.author.tag)
            msg.channel.send({ embeds: [phycembed] })
        } else if (msg.content == "<@921498042253852682>") {
            if (msg.author === client.user) {
                return
            }
            const phycembed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("PHYC")
            .setDescription(`**You can use 1help to see all commands!**`)
            .setFooter("Executed by " + msg.author.tag)
            msg.channel.send({ embeds: [phycembed] })
        }

        if (msg.content === "1servers") {
            msglog("servers")
            msg.channel.send(`**Currently in: ** ${client.guilds.cache.size} **servers**`);
        }

        if (msg.content.startsWith("https://")) {
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(msgauthor.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
                return
            }
            let data = fs.readFileSync("database.json", "utf8");
            let database = JSON.parse(data)
            let antilinkloc = "antilink-" + msg.guild.id
            if(database[antilinkloc] === "yes") {
                console.log(msg.author.tag + " sended link in " + msg.guild.id + " when autolink was on")
                if(msg.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                    msg.channel.bulkDelete(1, true)
                } else {
                    msg.channel.send("Bot has not permission to MANAGE_MESSAGES")
                }
            }
        } else if (msg.content.startsWith("http://")) {
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(msgauthor.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
                return
            }
            let data = fs.readFileSync("database.json", "utf8");
            let database = JSON.parse(data)
            let antilinkloc = "antilink-" + msg.guild.id
            if(database[antilinkloc] === "yes") {
                console.log(msg.author.tag + " sended link in " + msg.guild.id + " when autolink was on")
                if(msg.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                    msg.channel.bulkDelete(1, true)
                } else {
                    msg.channel.send("Bot has not permission to MANAGE_MESSAGES")
                }
            }
        } else if (msg.content.startsWith("ftp://")) {
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(msgauthor.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
                return
            }
            let data = fs.readFileSync("database.json", "utf8");
            let database = JSON.parse(data)
            let antilinkloc = "antilink-" + msg.guild.id
            if(database[antilinkloc] === "yes") {
                console.log(msg.author.tag + " sended link in " + msg.guild.id + " when autolink was on")
                if(msg.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                    msg.channel.bulkDelete(1, true)
                } else {
                    msg.channel.send("Bot has not permission to MANAGE_MESSAGES")
                }
            }
        } else if (msg.content.startsWith("file://")) {
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(msgauthor.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
                return
            }
            let data = fs.readFileSync("database.json", "utf8");
            let database = JSON.parse(data)
            let antilinkloc = "antilink-" + msg.guild.id
            if(database[antilinkloc] === "yes") {
                console.log(msg.author.tag + " sended link in " + msg.guild.id + " when autolink was on")
                if(msg.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                    msg.channel.bulkDelete(1, true)
                } else {
                    msg.channel.send("Bot has not permission to MANAGE_MESSAGES")
                }
            }
        }

        if (msg.content.startsWith("1antilink on")) {
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(!msgauthor.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
                const notconfigured = new MessageEmbed()
                .setColor("RED")
                .setTitle("**ANTILINK**")
                .setDescription("**ERROR**: Permission denied")
                return msg.channel.send({embeds: [notconfigured]})
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
            await msg.channel.send({embeds: [configured]})
        } else if (msg.content.startsWith("1antilink off")) {
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(!msgauthor.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
                const notconfigured = new MessageEmbed()
                .setColor("RED")
                .setTitle("**ANTILINK**")
                .setDescription("**ERROR**: Permission denied")
                return msg.channel.send({embeds: [notconfigured]})
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
            await msg.channel.send({embeds: [configured]})
        }

        if (msg.content == "1forceleave") {
            msglog("forceleave")
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if (!msgauthor.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                const noadmin = new MessageEmbed()
                .setColor("RED")
                .setTitle("Force-Leave")
                .setDescription("**ERROR**: Permission denied")
                .setFooter("Executed by " + msg.author.tag)
                return msg.channel.send({embeds: [noadmin] })
            }
            const leave = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("Force-Leave")
            .setDescription("**SUCCESS**: Bot leaved")
            .setFooter("Executed by " + msg.author.tag)
            msg.channel.send({embeds: [leave] })
            msg.guild.leave()
        }

        if (msg.content.startsWith("1mc")) {
            let args = msg.content.split(' ');
            let settings = { method: "Get" };
            try {
                fetch("https://api.mcsrvstat.us/2/" + args[1], settings)
                    .then(res => res.json())
                    .then((json) => {
                        if (json.online.toString() === "false") {
                            const mcstatusoffline = new MessageEmbed()
                            .setColor("RED")
                            .setTitle("**MC STATUS**")
                            .setDescription("**INFO**: Server is offline or unreachable")
                            return msg.channel.send({embeds: [mcstatusoffline] })
                        }
                        const mcstatus = new MessageEmbed()
                        .setColor("GREEN")
                        .setTitle("**MC STATUS**")
                        .addField("IP", json.ip)
                        .addField("PORT", json.port.toString())
                        .addField("MOTD", json.motd.clean[0])
                        .addField("ONLINE", json.players.online.toString())
                        .addField("MAX", json.players.max.toString())
                        .addField("VERSION", json.version.toString())
                        msg.channel.send({embeds: [mcstatus] })
                    });
                } catch (error) {
                    return msg.channel.send("**ERROR**: Unknown error")
                }
        }
        
        if (msg.content === "1statusrel") {
            if(parseInt(msg.author.id) != parseInt(botownerid)) {
                const statuspermissiondenied = new MessageEmbed()
                .setColor("RED")
                .setTitle("**RELOAD STATUS**")
                .setDescription("**ERROR**: You must be ADMIN of " + botname + " to use this command")
                .setFooter("Executed by " + msg.author.tag)
                return msg.channel.send({embeds: [statuspermissiondenied] })
            }
            client.user.setActivity(discordstatus)
            const statuschanged = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**RELOAD STATUS**")
            .setDescription("**SUCCESS**: Reloaded status")
            .setFooter("Executed by " + msg.author.tag)
            msg.channel.send({embeds: [statuschanged] })
        }

        if (msg.content === "1help") {
            msglog("help")
            const helpembed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**PHYC HELP**\n")
            .addField("Moderation", "1kick|1ban|1clear|1poll")
            .addField("Fun", "1work|1meme|1stonks")
            .addField("AntiLink", "1antilink <on/off>")
            .addField("Other", "1ping|1forceleave")
            msg.channel.send({ embeds: [helpembed] })
        }

        if (msg.content === "1ping") {
            const botpingem = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("PING")
            .setDescription(`**BOT Ping**: ${Date.now() - msg.createdTimestamp}ms\n**API Ping**: ${Math.round(client.ws.ping)}ms`)
            .setFooter("Executed by " + msg.author.tag)

            msg.channel.send({ embeds: [botpingem] })
        }

        if (msg.content.startsWith("1clear")) {
            msglog("clear")
            let args = msg.content.split(' ');
            const permissiondeniedem = new MessageEmbed()
            .setColor("RED")
            .setTitle("**CLEAR**")
            .setDescription("**ERROR**: Permission denied")
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(!msgauthor.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                return msg.channel.send({ embeds: [permissiondeniedem] })
            }
            if (args[1]==undefined) {
                const noargs = new MessageEmbed()
                .setColor("RED")
                .setTitle("**CLEAR**")
                .setDescription("**USAGE**: 1clear [AMOUNT]")
                return msg.channel.send({ embeds: [noargs] })
            }
            clearamount = parseInt(args[1]) + 1
            if (isNaN(args[1])) {
                const nan = new MessageEmbed()
                .setColor("RED")
                .setTitle("**CLEAR**")
                .setDescription("**USAGE**: 1clear [AMOUNT]")
                return msg.channel.send({ embeds: [nan] })
            }
            if (clearamount>100) {
                const toomuchamount = new MessageEmbed()
                .setColor("RED")
                .setTitle("**CLEAR**")
                .setDescription("**ERROR**: Clear command can clear only up to 99!")
                return msg.channel.send({ embeds: [toomuchamount] })
            }
            try {
                msg.channel.bulkDelete(clearamount, true)
            } catch(error) {
                msg.channel.send("failed")
            }
            const clearsuccess = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**CLEAR**")
            .setDescription("**SUCCESS**: Cleared " + args[1] + " message/s")
            msg.channel.send({ embeds: [clearsuccess] })
        }

        if (msg.content === "1meme") {
            msglog("meme")
            randomnumber = randomnum(1, 500)
            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**MEME**")
            .setDescription("Some meme for you")
            .setImage("https://ctk-api.herokuapp.com/meme/" + randomnumber)
            .setFooter("Executed by " + msg.author.tag)
            msg.channel.send({ embeds: [embed] })
        }

        if (msg.content.startsWith("1kick")) {
            msglog("kick")
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
            if(!member) return msg.channel.send({ embeds: [mentionuserem] })
            if(!member.kickable) return msg.channel.send({embeds: [permissiondeniedem] })
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(!msgauthor.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
                return msg.channel.send({ embeds: [permissiondeniedem] })
            }
            if(reason[2]==undefined) {
                reason[2] = "None"
            }
            if(reason[2].startsWith("<@!")) {
                const invalidusageem = new MessageEmbed()
                .setColor("RED")
                .setTitle("**BAN**")
                .setDescription("**ERROR**: Invalid usage!\n**USAGE**: 1ban @USER [REASON] (reason is not required)")
                return msg.channel.send({ embeds: [invalidusageem] });
            }
            member.kick(reason[2]);
            const embed = new MessageEmbed()
            .setColor("YELLOW")
            .setTitle("**KICK**")
            .setDescription("**Kick**: <@" + member + ">\n**Kicked by**: <@" + msg.author + ">\n**Reason**: " + reason[2])
            msg.channel.send({ embeds: [embed] })
        }

        if (msg.content.startsWith("1ban")) {
            msglog("ban")
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
            if(!member) return msg.channel.send({embeds: [mentionuserem]})
            if(!member.kickable) return msg.channel.send({embeds: [permissiondeniedem] })
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if(!msgauthor.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
                return msg.channel.send({ embeds: [permissiondeniedem] })
            }
            if(reason[2]==undefined) {
                reason[2] = "None"
            }
            if(reason[2].startsWith("<@!")) {
                const invalidusageem = new MessageEmbed()
                .setColor("RED")
                .setTitle("**BAN**")
                .setDescription("**ERROR**: Invalid usage!\n**USAGE**: 1ban @USER [REASON] (reason is not required)")
                return msg.channel.send({ embeds: [invalidusageem] });
            }
            const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle("**BAN**")
            .setDescription("**Ban**: <@" + member + ">\n**Banned by**: <@" + msg.author + ">\n**Reason**: " + reason[2])
            member.ban({reason: reason[2]});
            msg.channel.send({ embeds: [embed] })
        }

        if (msg.content.startsWith("1pg")) {
            msglog("pg")
            args = msg.content.split(' ');
            if (args[1]==undefined) {
                passwordsize = parseInt(21)
                randompass = randomString()
            } else {
                passwordsize = args[1]
            }
            if (isNaN(passwordsize)) {
                const nan = new MessageEmbed()
                .setColor("RED")
                .setTitle("**PASSWORD GENERATOR**")
                .setDescription("**ERROR**: Length must be a number (int)")
                return msg.channel.send({ embeds: [nan] })
            }
            if (passwordsize>100) {
                const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle("**PASSWORD GENERATOR**")
                .setDescription("**ERROR**: Password can be long only up to 100 characters")
                .setFooter("Do not give your password to others!")
                return msg.channel.send({ embeds: [embed] })
            }
            randompass = randomString()
            try {
                const embed = new MessageEmbed()
                .setColor("GREEN")
                .setTitle("**PASSWORD GENERATOR**")
                .setDescription("**Random password**: " + randompass + "\n**Length**: " + passwordsize)
                .setFooter("Do not give your password to others!")
                msg.channel.send({ embeds: [embed] })
            } catch (error) {
                console.log(error);
            }
        }

        if (msg.content == "1work") {
            msglog("work")
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
            const workembed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**WORK**")
            .setDescription("**Your Work**: " + work + "\n**Your Income**: " + income + "$\n** Your Gender**: " + gender)
            msg.channel.send({ embeds: [workembed] })
        }

        if (msg.content.startsWith("1calc")) {
            args = msg.content.split(' ');
            number1 = parseInt(args[1])
            operator = args[2]
            number2 = parseInt(args[3])
            const undefinedargument = new MessageEmbed()
                .setColor("RED")
                .setTitle("CALCULATOR")
                .setDescription("**ERROR**: Undefined arguments\n**USAGE**: 1calc <Number 1> <Operator> <Number 2>")
            if(number1==undefined) {
                return msg.channel.send({embeds: [undefinedargument]})
            } else if(operator==undefined) {
                return msg.channel.send({embeds: [undefinedargument]})
            } else if(number2==undefined) {
                return msg.channel.send({embeds: [undefinedargument]})
            }
            result = calculator(number1, operator, number2)
            if(result == "wrong-syntax") {
                return msg.channel.send("wrong syntax error in 1calc (executed by " + msg.author.tag + ")")
            } else if(result == "invalidop") {
                const invalidoperator = new MessageEmbed()
                .setColor("RED")
                .setTitle("CALCULATOR")
                .setDescription("**ERROR**: Invalid operator\n**Valid operators are**: +, -, *, /")
                return msg.channel.send({embeds: [invalidoperator]})
            } else if(result == "wrongnumber") {
                const wrongnumber = new MessageEmbed()
                .setColor("RED")
                .setTitle("CALCULATOR")
                .setDescription("**ERROR**: Unknown error\n**USAGE**: 1calc <Number 1> <Operator> <Number 2>")
                return msg.channel.send({embeds: [wrongnumber]})
            }
            const resultembed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**CALCULATOR**")
            .setDescription("**Result is**: " + result.toString())
            msg.channel.send({embeds: [resultembed]})
        }

        if (msg.content.startsWith("1poll")) {
            msglog("poll")
            arguments = msg.content.split("1poll ")[1]
            if (arguments==undefined) {
                const usage = new MessageEmbed()
                .setColor("RED")
                .setTitle("**POLL**")
                .setDescription("**USAGE**: 1poll <MESSAGE>")
                return msg.channel.send({ embeds: [usage] })
            }
            msgauthor = await msg.guild.members.fetch(msg.author.id)
            if (arguments.includes("@everyone")) {
                if (!msgauthor.permissions.has(Permissions.FLAGS.MENTION_EVERYONE)) {
                    const everyoneerror = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("**POLL**")
                    .setDescription("**ERROR**: You do not have permission to mention everyone!")
                    return msg.channel.send({ embeds: [everyoneerror] })
                }
            } else if (arguments.includes("@here")) {
                if (!msgauthor.permissions.has(Permissions.FLAGS.MENTION_EVERYONE)) {
                    const everyoneerror = new MessageEmbed()
                    .setColor("RED")
                    .setTitle("**POLL**")
                    .setDescription("**ERROR**: You do not have permission to mention everyone!")
                    return msg.channel.send({ embeds: [everyoneerror] })
                }
            }
            const poll = new MessageEmbed()
            .setColor("GREEN")
            .setTitle("**POLL**")
            .setDescription(arguments)
            try {
                msg.channel.bulkDelete(1, true)
            } catch(error) {
                msg.channel.send("Failed to delete command message!")
            }
            const pollmsg = await msg.channel.send({ embeds: [poll] })
            pollmsg.react("✅")
            pollmsg.react("❎")
        }

        if (msg.content.startsWith("1stonks")) {
            msglog("stonks")
            arguments = msg.content.split("1stonks ")[1]
            args = msg.content.split(' ')
            if (args[1]==undefined) {
                const stonksembed = new MessageEmbed()
                .setColor("GREEN")
                .setTitle("**STONKS**")
                .setImage("https://vacefron.nl/api/stonks?user=" + msg.author.displayAvatarURL() + "?size=4096")
                return msg.channel.send({ embeds: [stonksembed] })
            }
            let mumber = msg.mentions.members.first();
            if (!mumber) {
                const stonksembed = new MessageEmbed()
                .setColor("RED")
                .setTitle("**STONKS**")
                .setDescription("**ERROR**: You need to mention someone or invalid user!")
                return msg.channel.send({ embeds: [stonksembed] })
            }
            let member = client.users.fetch(mumber.id)
            member.then(function(memberget) {
                imageurl = memberget.displayAvatarURL();
                const stonksembed = new MessageEmbed()
                .setColor("GREEN")
                .setTitle("**STONKS**")
                .setImage("https://vacefron.nl/api/stonks?user=" + imageurl + "?size=4096")
                msg.channel.send({ embeds: [stonksembed] })
            })
        }

        if (msg.content.startsWith("1avatar")) {
            msglog("avatar")
            arguments = msg.content.split("1stonks ")[1]
            let mumber = msg.mentions.members.first();
            if (!mumber) {
                const avatarinvalid = new MessageEmbed()
                .setColor("RED")
                .setTitle("**AVATAR**")
                .setDescription("**ERROR**: You need to mention someone or invalid user!")
                return msg.channel.send({ embeds: [avatarinvalid] })
            }
            let member = client.users.fetch(mumber.id)
            member.then(function(memberget) {
                imageurl = memberget.displayAvatarURL();
                msg.channel.send(imageurl)
            })
        }

        if (msg.content === "1cat") {
            msglog("cat")
            cat = await neko.sfw.meow()
            const catembed = new MessageEmbed()
            .setColor("ORANGE")
            .setTitle("**CAT**")
            .setDescription("Some cat for you")
            .setImage(cat.url)
            msg.channel.send({ embeds: [catembed] })
        }

        if (msg.content === "1animeavatar") {
            msglog("animeavatar")
            animeavatar = await neko.sfw.avatar()
            const animeavatarembed = new MessageEmbed()
            .setColor("ORANGE")
            .setTitle("**Anime Avatar**")
            .setDescription("Some avatar for you")
            .setImage(animeavatar.url)
            msg.channel.send({ embeds: [animeavatarembed] })
        }
    } catch(error) {
        console.log("ERROR: " + error)
        return
    }
})

client.login("TOKEN")