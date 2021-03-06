import axios from 'axios';
import { setAlert } from './alertActions';
import { GET_PROFILE, PROFILE_ERROR } from './types';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/me');
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
