'use strict'

exports.getSteamAPIURL = (apiInterface, apiName, ver, args = {}) => {
    let url = '';
    url += process.env.STEAM_API_URL + '/';
    url += apiInterface + '/';
    url += apiName + '/';
    url += ver + '/';
    url += '?key=' + process.env.STEAM_API_KEY;

    const names = Object.keys(args);
    if (names.length > 0) {
        url += '&' + names.map(name => `${name}=${args[name]}`).join('&');
    }

    return url;
};

exports.getSteamSpyAPIURL = (request, args = {}) => {
    let url = '';
    url += process.env.STEAMSPY_API_URL + '/';
    url += '?request=' + request;

    const names = Object.keys(args);
    if (names.length > 0) {
        url += '&' + names.map(name => `${name}=${args[name]}`).join('&');
    }

    return url;
};