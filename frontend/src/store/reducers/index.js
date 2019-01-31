import * as actionTypes from '../actionTypes';

const initialState = {
    multiPlayerGames: [], //an array of multiplayer games, ['appId', 'appId'...]
    games: {}, //a handbook games data, {[appId]: {app-data}}
    users: [], //an array of users, [isLoading, ...user-data, games: ['appId', 'appId'...]}]
    intersection: [], //an array of displayed games, ['appId', 'appId'...]
    isMPGamesLoading: false, //is loading multiplayer games from API?
    isMPGamesStaled: false, //the first user has been added and MPGames are still loading?
    isCalculating: false, //is calculating intersection?
    errorMessage: null, //error message, null || string
};

//Reducer's functions
const startLoadMultiplayerGames = state => {
    return { ...state, isMPGamesLoading: true };
};

const finishLoadMultiplayerGames = (state, action) => {
    return {
        ...state,
        multiPlayerGames: action.payload,
        isMPGamesLoading: false,
        isMPGamesStaled: false,
    };
};

const startUserAdd = (state, action) => {
    const { vanityurl } = action.payload;

    const users = state.users.slice();
    users.push({ isLoading: true, vanityurl });

    return { ...state, users };
};

const finishUserAdd = (state, action) => {
    const userData = action.payload;
    const gamesIds = Object.keys(userData.games);

    //fill in new user data and games
    const users = state.users.map(user => {
        if (user.vanityurl === userData.vanityurl) {
            return {
                ...userData,
                games: gamesIds,
                isLoading: false
            };
        } else {
            return user;
        }
    });

    //fill in games "handbook" with new games data
    let newGames = {};
    gamesIds.forEach(appId => {
        newGames[appId] = {
            appId,
            ...userData.games[appId],
            nameLowerCase: userData.games[appId].name.toLowerCase(), //for sorting
        };
    });
    const games = { ...state.games, ...newGames };

    return {
        ...state,
        games,
        users,
        isMPGamesStaled: state.isMPGamesLoading, //set to true if multiplayer games still loading
    };
};

const userDelete = (state, action) => {
    const { steamId } = action.payload;

    const users = state.users.filter(user => user.steamId !== steamId);

    return { ...state, users };
};

const startIntersection = state => {
    return { ...state, isCalculating: true };
};

const doIntersection = state => {
    let intersection = [];

    //gather all users's games into an array of arrays
    let allArr = state.users.map(user => user.games);

    if (allArr.length > 1) {
        //add multiplayer games 
        allArr.push(state.multiPlayerGames);

        //calculate intersection of the arrays
        intersection = allArr.reduce((accumulator, currentArr) =>
            accumulator.filter(v => currentArr.includes(v))
        );

        //sort intersection according to lowercased games names
        intersection.sort((a, b) => {
            if (state.games[a].nameLowerCase > state.games[b].nameLowerCase) {
                return 1;
            }
            if (state.games[a].nameLowerCase < state.games[b].nameLowerCase) {
                return -1;
            }
            return 0;
        });
    }

    return { ...state, intersection };
};

const finishIntersection = state => {
    return { ...state, isCalculating: false };
};

const showError = (state, action) => {
    const { errorMessage } = action.payload;
    return { ...state, errorMessage };
};

const hideError = state => {
    return { ...state, errorMessage: null };
};

//Reducer
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.R_START_LOAD_MULTIPLAYER_GAMES:
            return startLoadMultiplayerGames(state, action);
        case actionTypes.R_FINISH_LOAD_MULTIPLAYER_GAMES:
            return finishLoadMultiplayerGames(state, action);
        case actionTypes.R_START_USER_ADD:
            return startUserAdd(state, action);
        case actionTypes.R_FINISH_USER_ADD:
            return finishUserAdd(state, action);
        case actionTypes.R_USER_DELETE:
            return userDelete(state, action);
        case actionTypes.R_START_INTERSECTION:
            return startIntersection(state, action);
        case actionTypes.R_DO_INTERSECTION:
            return doIntersection(state, action);
        case actionTypes.R_FINISH_INTERSECTION:
            return finishIntersection(state, action);
        case actionTypes.R_SHOW_ERROR:
            return showError(state, action);
        case actionTypes.R_HIDE_ERROR:
            return hideError(state, action);
        default:
            return state;
    }
};

export default reducer;
