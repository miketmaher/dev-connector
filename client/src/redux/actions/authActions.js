import axios from 'axios';
import { setAlert } from './alertActions';
import { REGISTER_FAIL, REGISTER_SUCCESS } from '../actions/types';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const registerUser = ({ name, email, password }) => async dispatch => {
  const body = JSON.stringify({ name, email, password });
  try {
    const res = await axios.post('/api/users', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};
