const Discord = require("discord.js")
const Crypto = require('crypto')
const { stdout } = require("process")
const client = new Discord.Client()
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
    }
}

imageurl = "none"

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
    discordstatus = "Phyc BETA | 1help"
    client.user.setActivity(discordstatus);
})

client.on("message", async msg => {
    authormessage = msg.author.tag
    
    if (msg.content == "<@!921498042253852682>") {
        if (msg.author === client.user) {
            return
        }
        const phycembed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle("PHYC")
        .setDescription(`**You can use 1help to see all commands!**`)
        .setFooter("Executed by " + msg.author.tag)
        msg.channel.send(phycembed)
    } else if (msg.content == "<@921498042253852682>") {
        if (msg.author === client.user) {
            return
        }
        const phycembed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle("PHYC")
        .setDescription(`**You can use 1help to see all commands!**`)
        .setFooter("Executed by " + msg.author.tag)
        msg.channel.send(phycembed)
    }

    if (msg.content === "1servers") {
        msglog("servers")
        msg.channel.send(`**Currently in: ** ${client.guilds.cache.size} **servers**`);
    }
    
    if (msg.content === "1help") {
        msglog("help")
        const helpembed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle("**PHYC HELP**\n\n***Moderation:***\n**1kick|1ban|1clear|1poll**\n\n***Fun:***\n**1work|1meme**\n\n***Other:***\n**1ping**")
        msg.channel.send(helpembed)
    }
    
    if (msg.content === "1ping") {
        const botpingem = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle("PING")
        .setDescription(`**BOT Ping**: ${Date.now() - msg.createdTimestamp}ms\n**API Ping**: ${Math.round(client.ws.ping)}ms`)
        .setFooter("Executed by " + msg.author.tag)
        
        msg.channel.send(botpingem)
    }

    if (msg.content.startsWith("1clear")) {
        msglog("clear")
        let args = msg.content.split(' ');
        const permissiondeniedem = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle("**CLEAR**")
        .setDescription("**ERROR**: Permission denied")
        if(!msg.guild.member(msg.author).hasPermission('MANAGE_MESSAGES')) {
            return msg.channel.send(permissiondeniedem)
        }
        if (args[1]==undefined) {
            const noargs = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("**CLEAR**")
            .setDescription("**USAGE**: 1clear [AMOUNT]")
            return msg.channel.send(noargs)
        }
        clearamount = parseInt(args[1]) + 1
        if (isNaN(args[1])) {
            const nan = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("**CLEAR**")
            .setDescription("**USAGE**: 1clear [AMOUNT]")
            return msg.channel.send(nan)
        }
        if (clearamount>100) {
            const toomuchamount = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("**CLEAR**")
            .setDescription("**ERROR**: Clear command can clear only up to 99!")
            return msg.channel.send(toomuchamount)
        }
        try {
            msg.channel.bulkDelete(clearamount, true)
        } catch(error) {
            msg.channel.send("failed")
        }
        const clearsuccess = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle("**CLEAR**")
        .setDescription("**SUCCESS**: Cleared " + args[1] + " message/s")
        msg.channel.send(clearsuccess)
    }

    if (msg.content === "1meme") {
        msglog("meme")
        randomnumber = randomnum(1, 500)
        const embed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle("**MEME**")
        .setDescription("Some meme for you")
        .setImage("https://ctk-api.herokuapp.com/meme/" + randomnumber)
        .setFooter("Executed by " + msg.author.tag)
        msg.channel.send(embed)
    }

    if (msg.content.startsWith("1kick")) {
        msglog("kick")
        reason = msg.content.split(' ');
        let member = msg.mentions.members.first();
        const mentionuserem = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle("**KICK**")
        .setDescription("**ERROR**: You need to mention user or invalid user!\n**USAGE**: 1kick @USER [REASON] (reason is not required)")
        const permissiondeniedem = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle("**KICK**")
        .setDescription("**ERROR**: Permission denied")
        if(!member) return msg.channel.send(mentionuserem)
        if(!member.kickable) return msg.channel.send(permissiondeniedem)
        if(!msg.guild.member(msg.author).hasPermission('KICK_MEMBERS')) {
            return msg.channel.send(permissiondeniedem)
        }
        if(reason[2]==undefined) {
            reason[2] = "None"
        }
        if(reason[2].startsWith("<@!")) {
            const invalidusageem = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("**BAN**")
            .setDescription("**ERROR**: Invalid usage!\n**USAGE**: 1ban @USER [REASON] (reason is not required)")
            return msg.channel.send(invalidusageem);
        }
        member.kick(reason[2]);
        const embed = new Discord.MessageEmbed()
        .setColor("YELLOW")
        .setTitle("**KICK**")
        .setDescription("**Kick**: <@" + member + ">\n**Kicked by**: <@" + msg.author + ">\n**Reason**: " + reason[2])
        msg.channel.send(embed)
    }
    
    if (msg.content.startsWith("1ban")) {
        msglog("ban")
        reason = msg.content.split(' ');
        let member = msg.mentions.members.first();
        const mentionuserem = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle("**BAN**")
        .setDescription("**ERROR**: You need to mention user or invalid user!\n**USAGE**: 1ban @USER [REASON] (reason is not required)")
        const permissiondeniedem = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle("**BAN**")
        .setDescription("**ERROR**: Permission denied")
        if(!member) return msg.channel.send(mentionuserem)
        if(!member.kickable) return msg.channel.send(permissiondeniedem)
        if(!msg.guild.member(msg.author).hasPermission('BAN_MEMBERS')) {
            return msg.channel.send(permissiondeniedem)
        }
        if(reason[2]==undefined) {
            reason[2] = "None"
        }
        if(reason[2].startsWith("<@!")) {
            const invalidusageem = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("**BAN**")
            .setDescription("**ERROR**: Invalid usage!\n**USAGE**: 1ban @USER [REASON] (reason is not required)")
            return msg.channel.send(invalidusageem);
        }
        const embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle("**BAN**")
        .setDescription("**Ban**: <@" + member + ">\n**Banned by**: <@" + msg.author + ">\n**Reason**: " + reason[2])
        member.ban({reason: reason[2]});
        msg.channel.send(embed)
    }
    
    if (msg.content.startsWith("1pg")) {
        msglog("pg")
        args = msg.content.split(' ');
        if (isNaN(args[1])) {
            const nan = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("**PASSWORD GENERATOR**")
            .setDescription("**ERROR**: Length must be a number (int)")
            return msg.channel.send(nan)
        }
        if (args[1]==undefined) {
            passwordsize = parseInt(21)
            randompass = randomString()
        } else {
            passwordsize = args[1]
        }
        if (passwordsize>100) {
            const embed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("**PASSWORD GENERATOR**")
            .setDescription("**ERROR**: Password can be long only up to 100 characters")
            .setFooter("Do not give your password to others!")
            return msg.channel.send(embed)
        }
        randompass = randomString()
        try {
            const embed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("**PASSWORD GENERATOR**")
            .setDescription("**Random password**: " + randompass)
            .setFooter("Do not give your password to others!")
            msg.channel.send(embed)
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
        const workembed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle("**WORK**")
        .setDescription("**Your Work**: " + work + "\n**Your Income**: " + income + "$\n** Your Gender**: " + gender)
        msg.channel.send(workembed)
    }
    
    if (msg.content.startsWith("1poll")) {
        msglog("poll")
        arguments = msg.content.split("1poll ")[1]
        if (arguments==undefined) {
            const usage = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("**POLL**")
            .setDescription("**USAGE**: 1poll <MESSAGE>")
            return msg.channel.send(usage)
        }
        const poll = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle("**POLL**")
        .setDescription(arguments)
        try {
            msg.channel.bulkDelete(1, true)
        } catch(error) {
            msg.channel.send("Failed to delete command message!")
        }
        const pollmsg = await msg.channel.send(poll)
        pollmsg.react("✅")
        pollmsg.react("❎")
    }

    if (msg.content.startsWith("1argtest")) {
        arguments = msg.content.split("1argtest ")[1]
        msg.channel.send(arguments)
    }

    if (msg.content.startsWith("1stonks")) {
        arguments = msg.content.split("1stonks ")[1]
        args = msg.content.split(' ')
        if (args[1]==undefined) {
            const stonksembed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("**STONKS**")
            .setImage("https://vacefron.nl/api/stonks?user=" + msg.author.displayAvatarURL() + "?size=4096")
            return msg.channel.send(stonksembed)
        }
        let mumber = msg.mentions.members.first();
        if (!mumber) {
            const stonksembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("**STONKS**")
            .setDescription("**ERROR**: You need to mention someone or invalid user!")
            return msg.channel.send(stonksembed)
        }
        let member = client.users.fetch(mumber.id)
        member.then(function(memberget) {
            imageurl = memberget.displayAvatarURL();
            const stonksembed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("**STONKS**")
            .setImage("https://vacefron.nl/api/stonks?user=" + imageurl + "?size=4096")
            msg.channel.send(stonksembed)
        })
    }

    if (msg.content.startsWith("1avatar")) {
        arguments = msg.content.split("1stonks ")[1]
        let mumber = msg.mentions.members.first();
        if (!mumber) {
            const avatarinvalid = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("**AVATAR**")
            .setDescription("**ERROR**: You need to mention someone or invalid user!")
            return msg.channel.send(avatarinvalid)
        }
        let member = client.users.fetch(mumber.id)
        member.then(function(memberget) {
            imageurl = memberget.displayAvatarURL();
            msg.channel.send(imageurl)
        })
    }

    if (msg.content === "1cat") {
        cat = await neko.sfw.meow()
        const catembed = new Discord.MessageEmbed()
        .setColor("ORANGE")
        .setTitle("**CAT**")
        .setDescription("Some cat for you")
        .setImage(cat.url)
        msg.channel.send(catembed)
    }
    
    if (msg.content === "1wallpaper") {
        if (!msg.channel.nsfw) {
            const wallnsfwembed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("**Wallpaper**")
            .setDescription("**ERROR**: In these wallpapers can be found some NSFW ones")
            return msg.channel.send(wallnsfwembed)
        }
        wall = await neko.sfw.wallpaper()
        const wallembed = new Discord.MessageEmbed()
        .setColor("ORANGE")
        .setTitle("**Wallpaper**")
        .setDescription("Some wallpaper for you")
        .setImage(wall.url)
        msg.channel.send(wallembed)
    }

    if (msg.content === "1animeavatar") {
        animeavatar = await neko.sfw.avatar()
        const animeavatarembed = new Discord.MessageEmbed()
        .setColor("ORANGE")
        .setTitle("**Anime Avatar**")
        .setDescription("Some avatar for you")
        .setImage(animeavatar.url)
        msg.channel.send(animeavatarembed)
    }
})

client.login("TOKEN")