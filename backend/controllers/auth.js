const jwt = require("jsonwebtoken");
const qs = require("querystring");
const { getUser, createUser } = require("../services/auth");
const { getGuilds } = require("../services/user");
const { default: axios } = require("axios");

require("dotenv").config();

exports.loginUser = async (req, res) => {
    const code = req.body.token;

    try {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        const url = new URL("https://discordapp.com/api/oauth2/token");
        const params = {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: "authorization_code",
            code,
            redirect_uri: process.env.REDIRECT_URI,
            scope: "identify",
        };
        const tokenData = await axios.post(url.toString(), qs.stringify(params), config);
        const token = tokenData.data.access_token;
        const data = await axios.get(`https://discord.com/api/users/@me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(data.data);

        const { id, username } = data.data;
        let user = await getUser({ userId: id });
        if (!user) {
            await createUser({ userId: id, username });
        }
        const guilds = await getGuilds({ userId: id });

        console.log(guilds);

        if (guilds.length === 0) {
            return res.status(400).json({
                success: false,
                error: "No guilds found",
            });
        }

        const payload = {
            userId: id,
            guildId: guilds[0].guildId,
        };

        const secret = process.env.JWT_SECRET;
        const options = {
            expiresIn: "1d",
        };
        const accessToken = jwt.sign(payload, secret, options);

        res.status(200).json({
            success: true,
            data: {
                accessToken,
                guilds,
            },
        });


    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
        });
    }
}

exports.getGuilds = async (req, res) => {
    try {
        console.log(req.user);
        const userId = req.userId;

        const guilds = await getGuilds({ userId });
        res.status(200).json({
            success: true,
            data: guilds,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
}

exports.changeGuild = async (req, res) => {
    try {
        const userId = req.userId;
        const guildId = req.body.guildId;
        const guilds = await getGuilds({ userId });

        const guild = guilds.find((guild) => guild.guildId === guildId);

        if (!guild) {
            return res.status(400).json({
                success: false,
                error: "Guild not found",
            });
        }

        const payload = {
            userId,
            guildId,
        };

        const secret = process.env.JWT_SECRET;
        const options = {
            expiresIn: "1h",
        };
        const accessToken = jwt.sign(payload, secret, options);

        res.status(200).json({
            success: true,
            data: {
                accessToken,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
}