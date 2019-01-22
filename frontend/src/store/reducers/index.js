import * as actionTypes from '../actionTypes';

const initialState = {
    multiPlayerGames: [], //an array with multiplayer games, ['appId', 'appId'...]
    games: {}, //a handbook of games, {[appId]: {app-data}}
    users: {}, //a handbook of users, {[steamId]: {user-data, games: ['appId', 'appId'...]}}
    intersection: [], //an array of displayed games, ['appId', 'appId'...]
    isMPGamesLoading: false, //is loading multiplayer games from API?
    isMPGamesStaled: false, //the first user has been added and MPGames are still loading?
    isUserLoading: false, //is loading a user from API?
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
    return { ...state, isUserLoading: true };
};

const finishUserAdd = (state, action) => {
    const userData = action.payload;
    const gamesIds = Object.keys(userData.games);

    //fill in new user data and games
    const users = {
        ...state.users,
        [userData.steamId]: {
            ...userData,
            games: gamesIds,
        },
    };

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
        isUserLoading: false,
        isMPGamesStaled: state.isMPGamesLoading, //set to true if multiplayer games still loading
    };
};

const userDelete = (state, action) => {
    const { steamId } = action.payload;

    const users = { ...state.users };
    delete users[steamId];

    return { ...state, users };
};

const startIntersection = state => {
    return { ...state, isCalculating: true };
};

const doIntersection = state => {
    let intersection = [];
    const usersIds = Object.keys(state.users);
    if (usersIds.length > 1) {
        //gather all users's games and multiplayer games into single array of arrays
        let allArr = usersIds.map(id => state.users[id].games);
        allArr.push(state.multiPlayerGames);

        //calculate intersection of all these arrays
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
    const {errorMessage} = action.payload;
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
