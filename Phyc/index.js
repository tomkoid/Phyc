const { Client, Intents, MessageEmbed, Permissions } = require("discord.js")
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] })
const Crypto = require('crypto')
const { stdout } = require("process")
const nekosapi = require('nekos.life')
const neko = new nekosapi();

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
            returnednumber = "invalid"
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
    discordstatus = "Phyc BETA | 1help"
    client.user.setActivity(discordstatus);
})

client.on("messageCreate", async msg => {
    authormessage = msg.author.tag
    
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
    
    if (msg.content == "1forceleave") {
        msglog("forceleave")
        msgauthor = await msg.guild.members.fetch(msg.author.id)
        if (!msgauthor.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            const noadmin = new MessageEmbed()
            .setColor("RED")
            .setTitle("Force-Leave")
            .setDescription("**ERROR**: Permission denied")
            .setFooter("Executed by " + msg.author.tag)
            console.log("dont have perms")
            return msg.channel.send({embeds: [noadmin] })
        }
        const leave = new MessageEmbed()
        .setColor("GREEN")
        .setTitle("Force-Leave")
        .setDescription("**SUCCESS**: Leaved")
        .setFooter("Executed by " + msg.author.tag)
        msg.channel.send({embeds: [leave] })
        msg.guild.leave()
    }

    if (msg.content === "1help") {
        msglog("help")
        const helpembed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle("**PHYC HELP**\n\n***Moderation:***\n**1kick|1ban|1clear|1poll**\n\n***Fun:***\n**1work|1meme**\n\n***Other:***\n**1ping**")
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
            console.log("is undefined")
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
            .setDescription("**Random password**: " + randompass)
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
        result = calculator(number1, operator, number2)
        if(result == "wrong-syntax") {
            msg.channel.send("wrong syntax")
        } else if(result == "invalidop") {
            msg.channel.send("invalid operator!")
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
    
    if (msg.content === "1wallpaper") {
        msglog("wallpaper")
        if (!msg.channel.nsfw) {
            const wallnsfwembed = new MessageEmbed()
            .setColor("RED")
            .setTitle("**Wallpaper**")
            .setDescription("**ERROR**: In these wallpapers can be found some NSFW ones")
            return msg.channel.send({ embeds: [wallnsfwembed] })
        }
        wall = await neko.sfw.wallpaper()
        const wallembed = new MessageEmbed()
        .setColor("ORANGE")
        .setTitle("**Wallpaper**")
        .setDescription("Some wallpaper for you")
        .setImage(wall.url)
        msg.channel.send({ embeds: [wallembed] })
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
})

client.login("TOKEN")