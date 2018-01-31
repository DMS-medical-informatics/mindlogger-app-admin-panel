import * as types from '../constants/actionTypes';

export const signup = (body) => ({
    type: types.SIGN_UP,
    method: 'POST',
    path: '/user',
    body,
});

export const createProfile = (body) => ({
    type: types.PUT_USER,
    method: 'PUT',
    path: '/user',
    body,
});

export const changePassword = (body) => ({
    type: types.CHANGE_PASSWORD,
    method: 'POST',
    path: '/user/change-password',
    body,
});

export const forgotPassword = (body) => ({
  type: types.FORGOT_PASSWORD,
  method: 'POST',
  path: '/user/forgot-password',
  body,
});

export const resetPassword = (body) => ({
  type: types.RESET_PASSWORD,
  method: 'POST',
  path: '/user/reset-password',
  body,
});

export const signin = (body) => ({
  type: types.SIGN_IN,
  method: 'POST',
  path: '/login',
  body,
});

export const getUsers = (offset, limit) => ({
  type: types.GET_USERS,
  method: 'GET',
  path: `/users?offset=${offset}&limit=${limit}`
})

export const signout = (body) => ({
  type: types.SIGN_OUT,
  method: 'DELETE',
  path: '/logout',
})