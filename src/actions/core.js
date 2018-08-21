import * as types from '../constants/actionTypes';

export const setAct = (act) => ({
    type: types.SET_DATA,
    data: { act },
});

export const setAnswer = (answer) => ({
    type: types.SET_DATA,
    data: { answer },
});

export const setVolume = (volume) => ({
    type: types.SET_DATA,
    data: { volume }
});

export const setDataObject = (object) => ({
    type: types.SET_DATA_OBJECT,
    object
});

export const setActChanged = (actChanged) => ({
    type: types.SET_DATA,
    data: { actChanged }
})
