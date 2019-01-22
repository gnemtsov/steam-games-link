
# About
A small app that takes steam community profiles urls and shows common multiplayer games.

# Prerequisites
Node.js, yarn, redis and [Redux DevTools extension](https://github.com/zalmoxisus/redux-devtools-extension).

# Installation (local)
1. Download or git clone the source code
2. Run `yarn install` in the backend folder
3. Run `yarn install` in the frontend folder
4. Create file /backend/.env with the following contents:
```
#Environment
NODE_ENV='development'

#STEAM API settings
STEAM_API_URL='http://api.steampowered.com'
STEAM_API_KEY='[your steam api key]'

#STEAMSPY API settings
STEAMSPY_API_URL='http://steamspy.com/api.php'

#REDIS settings
REDIS_HOST='127.0.0.1'
REDIS_PORT='6379'
``` 

# Run locally
1. Run `yarn start` in the backend folder
2. Run `yarn start` in the frontend folder

Enjoy :smiley:

# Accounts for testing
```
https://steamcommunity.com/id/gwellir
https://steamcommunity.com/id/molotoko
https://steamcommunity.com/id/Tryr
```
