import {
    SET_USER,
    // SET_ERRORS, CLEAR_ERRORS, LOADING_UI,
    SET_AUTHENTICATED,
    SET_UNAUTHENTICATED,
    LOADING_USER,
    LIKE_BUZZ,
    UNLIKE_BUZZ
} from "../types";

const initialState = {
    authenticated: false,
    loading: false,
    // holds all the user details such as handle etc.
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
                loading: false,
                // this will set the payload info in initial state
                ...action.payload
            };
        case LOADING_USER:
            return {
                ...state,
                loading: true
            };
        case LIKE_BUZZ:
            return {
                ...state,
                likes: [
                    ...state.likes,
                    {
                        userHandle: state.credentials.handle,
                        buzzId: action.payload.buzzId
                    }
                ]
            };
        case UNLIKE_BUZZ:
            return {
                ...state,
                // remove the like that corresponds to the buzzId
                likes: state.likes.filter(
                    (like) => like.buzzId === action.payload.buzzId
                )
            };
        default:
            return state;
    }
}
