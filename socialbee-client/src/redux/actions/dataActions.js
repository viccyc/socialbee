import { SET_BUZZES, LOADING_DATA, LIKE_BUZZ, UNLIKE_BUZZ, DELETE_BUZZ } from '../types';
import axios from 'axios';

// get all buzzes
export const getBuzzes = () => dispatch => {
    dispatch({ type: LOADING_DATA });
    axios.get('/buzzes')
        .then(res => {
            dispatch({
                type: SET_BUZZES,
                payload: res.data
            })
        })
        .catch((err) => {
            dispatch({
                type: SET_BUZZES,
                payload: []
            })
        });
};

export const likeBuzz = (buzzId) => dispatch => {
    axios.get(`/buzz/${buzzId}/like`)
        .then((res) => {
            dispatch({
                type: LIKE_BUZZ,
                payload: res.data
            })
        })
        .catch((err) => {
            console.log(err);
        })
};

export const unlikeBuzz = (buzzId) => dispatch => {
    axios.get(`/buzz/${buzzId}/unlike`)
        .then((res) => {
            dispatch({
                type: UNLIKE_BUZZ,
                payload: res.data
            })
        })
        .catch((err) => {
            console.log(err);
        })
};

export const deleteBuzz = (buzzId) => (dispatch) => {
    axios.delete(`/buzz/${buzzId}`)
        .then(() => {
            dispatch({ type: DELETE_BUZZ, payload: buzzId })
        })
        .catch(err => console.log(err));
};
