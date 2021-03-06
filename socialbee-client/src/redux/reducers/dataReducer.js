import {SET_BUZZES, LOADING_DATA, LIKE_BUZZ, UNLIKE_BUZZ,
    DELETE_BUZZ, POST_BUZZ, SET_BUZZ, SUBMIT_COMMENT
} from '../types';

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
        case SET_BUZZ:
            return {
                ...state,
                buzz: action.payload
            };
        case LIKE_BUZZ:
        case UNLIKE_BUZZ:
            index = state.buzzes.findIndex(
                (buzz) => buzz.buzzId === action.payload.buzzId);
            state.buzzes[index] = action.payload;
            // if we un/like a buzz and it has the same Id as the one
            // open in the dialog, then we need to update it
            if (state.buzz.buzzId === action.payload.buzzId) {
                state.buzz = { ...state.buzz, ...action.payload };
            }
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
        case SUBMIT_COMMENT:
            // need to take the comment for the buzz object and put at top
            // of comments array
            return {
                ...state,
                buzz: {
                    ...state.buzz,
                    comments: [action.payload, ...state.buzz.comments]
                }
            };
        default:
            return state;
    }
}
