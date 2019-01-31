'use strict';

/*
In the development environment parameters are taken from the local .env file using dotenv library
In the production environment parameters should be set directly from the server environment or even better from AWS parameter store
For development and production we should use different credentials, keys, secrets.
We shouldn't commit secrets into the repository and expose them in the source code.
*/
if (process.env.NODE_ENV === undefined) {
    require('dotenv').config();
}

const axios = require('axios');
const express = require('express');
const compression = require('compression');
const redis = require('redis');
const { promisify } = require('util');

const utils = require('./utils');

/*********Unhandled errors*********/
process.on('uncaughtException', e => {
    console.log(e); //in a real app use custom logger to report errors
    process.exit(1);
});
process.on('unhandledRejection', e => {
    console.log(e); //in a real app use custom logger to report errors
    process.exit(1);
});

/*********Set up redis client*********/
const client = redis.createClient(
    process.env.REDIS_PORT,
    process.env.REDIS_HOST
);

client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('error', function(err) {
    console.log('Something went wrong ' + err); //in a real app use custom logger to report errors
});

/*********Helper functions*********/
//This function calls redis client commands as a Promise-based functions
const redisAsync = function callPromisifiedClientFunction() {
    const [fnName, ...args] = [...arguments];
    return promisify(client[fnName]).apply(client, args);
};

//This function takes an async middleware and returns it with .catch(next) attached.
//All errors inside returned middleware will be caught by this .catch(next).
//We won't have to wrap with try/catch every async operation within the async middleware.
const withErrorHandler = function getWrappedAsyncMiddleware(fn) {
    return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
};

//Middleware, which takes array from cache
//options: {key: [name of redis key]}
//I don't call next(err) because the app actually can work without redis.
//In a real app we'll need to inform developers, that redis isn't working.
const getCachedArray = function getCacheArrayMiddleware(options) {
    return async (req, res, next) => {
        if (!client.connected) return next();

        try {
            const result = await redisAsync('exists', options.key);
            if (result) {
                req[options.key] = await redisAsync('smembers', options.key);
            }
            return next();
        } catch (err) {
            console.log(err); //in a real app use custom logger to report errors
        }
    };
};

/*********Set up ExpressJS API*********/
const app = express();

app.use(compression());

//Serve the front-end build for root path
app.use('/', express.static('frontend_build'));

//GET /multiplayergames
//returns appIds of multiplayer games as array
const redisKey = 'multiplayer games';
app.get(
    '/multiplayergames',

    //try to get multiplayer games from cache
    getCachedArray({ key: redisKey }),

    //fetch multiplayer games if needed and store them in cache
    withErrorHandler(async (req, res, next) => {
        if (req.multiplayerGames === undefined) {
            const result = await axios.get(
                utils.getSteamSpyAPIURL('tag', { tag: 'Multiplayer' })
            );
            req.multiplayerGames = Object.keys(result.data);

            if (!client.connected) return next();

            try {
                client.sadd(redisKey, req.multiplayerGames);
                client.expire(redisKey, 1800); //expire cache after 30 minutes
            } catch (err) {
                console.log(err); //in a real app use custom logger to report errors
            }
        }
        return next();
    }),

    //send data to the front-end
    (req, res) => res.status(200).json(req.multiplayerGames)
);

//GET /userownedgames/:vanityurl
//returns user data and array with his/her games
app.get(
    '/userownedgames/:vanityurl',

    //fetch uses's steamId by vanityurl
    withErrorHandler(async (req, res, next) => {
        const { vanityurl } = req.params;

        const url = utils.getSteamAPIURL(
            'ISteamUser',
            'ResolveVanityURL',
            'v1',
            { vanityurl }
        );

        const result = await axios.get(url);
        const { success, steamid, message } = result.data.response;

        if (success !== 1) {
            let errorMessage;
            switch (success) {
                case 42:
                    errorMessage = 'User not found';
                    break;
                default:
                    errorMessage = `STEAM API. ISteamUser - ResolveVanityURL: ${message}`;
            }
            return next(new Error(errorMessage));
        }

        req.steamId = steamid;
        return next();
    }),

    //fetch user's data and games, send them to the front-end
    withErrorHandler(async (req, res, next) => {
        const { steamId } = req;

        const url1 = utils.getSteamAPIURL(
            'ISteamUser',
            'GetPlayerSummaries',
            'v2',
            { steamids: steamId }
        );

        const url2 = utils.getSteamAPIURL(
            'IPlayerService',
            'GetOwnedGames',
            'v1',
            { steamid: steamId, format: 'json', include_appinfo: 1 }
        );

        const [result1, result2] = await Promise.all([
            axios.get(url1),
            axios.get(url2),
        ]);

        const [userData] = result1.data.response.players;

        if (userData.communityvisibilitystate !== 3) {
            return next(new Error('Not a public profile'));
        }

        const {
            personaname: name,
            avatarmedium: avatar,
            realname: realName,
        } = userData;

        const { games: userGames } = result2.data.response;
        const games = {};

        if (userGames !== undefined) {
            userGames.forEach(({ appid, name, img_logo_url }) => {
                games[appid] = {
                    name,
                    logo: img_logo_url,
                };
            });
        }

        res.status(200).json({
            steamId,
            name,
            realName,
            avatar,
            games,
        });
    })
);

//Custom Express error handler
app.use((err, req, res, next) => {
    console.log('Error middleware', err); //in a real app use custom logger to report errors
    res.status(500).send(err.message);
});

//Start API
app.listen(3001, () => {
    console.log('Server running on port 3001');
});
