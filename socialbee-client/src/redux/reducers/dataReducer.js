import {SET_BUZZES, LOADING_DATA, LIKE_BUZZ, UNLIKE_BUZZ, DELETE_BUZZ, POST_BUZZ} from '../types';

const initialState = {
    buzzes: [],
    buzz: {},
    loading: false
};

export default function (state= initialState, action) {
    let index;
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            };
        case SET_BUZZES:
            return {
                ...state,
                buzzes: action.payload,
                loading: false
            };
        case LIKE_BUZZ:
        case UNLIKE_BUZZ:
            index = state.buzzes.findIndex((buzz) => buzz.buzzId === action.payload.buzzId);
            state.buzzes[index] = action.payload;
            return {
                ...state
            };
        case DELETE_BUZZ:
            index = state.buzzes.findIndex((buzz) => buzz.buzzId === action.payload);
            state.buzzes.splice(index, 1);
            return {
                ...state
            };
        case POST_BUZZ:
            return {
                ...state,
                buzzes: [
                    action.payload,
                    ...state.buzzes
                ]
            };
        default:
            return state;
    }
}
