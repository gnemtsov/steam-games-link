import { put, call, cancel, takeEvery, all } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import axios from 'axios';

import * as actionTypes from '../actionTypes';

/*
Sagas logic notes
- Load array of multiplayer games (loadMultiplayerGames saga) once when App component is mounted.
- When user is added add his/her data, games list and games data to the store (userAdd saga).
- When user is deleted remove user data and games list from the store (userDelete saga).

Each time when a user is added or deleted recalculate intersection.
*/

function* loadMultiplayerGames() {
    yield put({ type: actionTypes.R_START_LOAD_MULTIPLAYER_GAMES });

    const response = yield call(axios.get, '/multiplayergames');
    if (response === undefined) {
        yield cancel();
    }

    yield put({
        type: actionTypes.R_FINISH_LOAD_MULTIPLAYER_GAMES,
        payload: response.data,
    });
}

function* userAdd(action) {
    const { vanityurl } = action.payload;

    yield put({ type: actionTypes.R_START_USER_ADD, payload: { vanityurl } });

    const response = yield call(axios.get, `/userownedgames/${vanityurl}`);
    if (response === undefined) {
        yield cancel();
    }

    yield put({
        type: actionTypes.R_FINISH_USER_ADD,
        payload: { ...response.data, vanityurl },
    });

    yield delay(500);
    yield put({ type: actionTypes.R_DO_INTERSECTION });
}

function* userDelete(action) {
    const { index } = action.payload;

    yield put({ type: actionTypes.R_USER_DELETE, payload: { index } });

    yield delay(500);
    yield put({ type: actionTypes.R_DO_INTERSECTION });
}

export default function* rootSaga() {
    yield all([
        takeEvery(actionTypes.S_LOAD_MULTIPLAYER_GAMES, loadMultiplayerGames),
        takeEvery(actionTypes.S_USER_ADD, userAdd),
        takeEvery(actionTypes.S_USER_DELETE, userDelete),
    ]);
}
