import {
    SET_BUZZES, LOADING_DATA, LIKE_BUZZ, UNLIKE_BUZZ,
    DELETE_BUZZ, LOADING_UI, POST_BUZZ, CLEAR_ERRORS,
    SET_ERRORS, SET_BUZZ, STOP_LOADING_UI, SUBMIT_COMMENT
} from '../types';
import axios from 'axios';

// get all buzzes
export const getBuzzes = () => (dispatch)=> {
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

export const getBuzz = (buzzId) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios.get(`/buzz/${buzzId}`)
        .then((res) => {
            dispatch({
                type: SET_BUZZ,
                payload: res.data
            });
            dispatch({ type: STOP_LOADING_UI });
        })
        .catch((err) => console.log(err));
};

export const postBuzz = (newBuzz) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    console.log('newBuzz:', newBuzz);
    axios.post('/buzz', newBuzz)
        .then((res) => {
            console.log('res data:', res.data);
            dispatch({
                type: POST_BUZZ,
                payload: res.data
            });
            dispatch(clearErrors());
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data
            });
        });
};

export const likeBuzz = (buzzId) => (dispatch) => {
    axios.get(`/buzz/${buzzId}/like`)
        .then((res) => {
            dispatch({
                type: LIKE_BUZZ,
                payload: res.data
            })
        })
        .catch((err) => {
            console.log(err);
        });
};

export const unlikeBuzz = (buzzId) => (dispatch) => {
    axios.get(`/buzz/${buzzId}/unlike`)
        .then((res) => {
            dispatch({
                type: UNLIKE_BUZZ,
                payload: res.data
            })
        })
        .catch((err) => {
            console.log(err);
        });
};

export const submitComment = (buzzId, commentData) => (dispatch) => {
  axios.post(`/buzz/${buzzId}/comment`, commentData)
      .then((res) => {
          dispatch({
              type: SUBMIT_COMMENT,
              payload: res.data
          });
          dispatch(clearErrors());
      })
      .catch((err) => {
          dispatch({
              type: SET_ERRORS,
              payload: err.response.data
          });
      });
};

export const deleteBuzz = (buzzId) => (dispatch) => {
    axios.delete(`/buzz/${buzzId}`)
        .then(() => {
            dispatch({ type: DELETE_BUZZ, payload: buzzId })
        })
        .catch(err => console.log(err));
};

export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
