import {SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI,
    SET_AUTHENTICATED, SET_UNAUTHENTICATED} from "../types";

const initialState = {
    authenticated: false,
    credentials: {},
    likes: [],
    notifications: []
};

// uses action that we receive and do something depending on its type
export default function (state = initialState, action) {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                // spread the state that we have and change some things
                ...state,
                authenticated: true
            };
        case SET_UNAUTHENTICATED:
            return initialState;
        case SET_USER:
            return {
                authenticated: true,
                // this will set the payload info in initial state
                ...action.payload
            };
        default:
            return state;
    }
}
