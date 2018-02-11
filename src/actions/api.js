import * as types from '../constants/actionTypes';
function generateQuery(params) {
  var esc = encodeURIComponent;
  let result = []
  Object.keys(params)
    .forEach(k => {
      if(params[k]) 
        result.push(esc(k) + '=' + esc(params[k]))
    })
  return result.join('&')
}

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

export const inviteUser = (body) => ({
  type: types.POST_USER,
  method: 'POST',
  path: '/invite_user',
  body,
})

/* ----- Acts ----- */

export const getActs = () => ({
  type: types.GET_LIST,
  method: 'GET',
  path: '/acts'
})

export const getAssignedActs = (userId) => ({
  type: types.GET_LIST,
  method: 'GET',
  path: `/users/${userId}/assigned_acts`
})

export const searchActs = (keyword, offset, limit ) => ({
  type: types.GET_LIST,
  method: 'GET',
  path: `/acts/search?keyword=${keyword}&offset=${offset}&limit=${limit}`
})

export const assignAct = (userId, actId) => ({
  type: types.GET_LIST,
  method: 'PUT',
  path: `/users/${userId}/assign/${actId}`
})

export const cancelAct = (userId, actId) => ({
  type: types.PUT_ACTION,
  method: 'PUT',
  path: `/acts/${actId}/assign/${actId}?is_delete=true`
})

/*------ answers ----- */

export const getAnswers = (userId, offset, limit, start_date, end_date) => ({
  type: types.GET_LIST,
  method: 'GET',
  path: `/users/${userId}/answers?${generateQuery({offset, limit, start_date, end_date})}`
})

export const getAnsweredActs = (userId) => ({
  type: types.GET_LIST,
  method: 'GET',
  path: `/users/${userId}/answered_acts`
})
