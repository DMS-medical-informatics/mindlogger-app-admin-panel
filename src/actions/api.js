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

export const changeProfile = (body) => ({
  type: types.CHANGE_PROFILE,
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

export const signin = ({user, password}) => ({
  type: types.SIGN_IN,
  method: 'GET',
  path: '/user/authentication',
  extraHeaders: { 'Girder-Authorization': `Basic ${btoa(user + ":" + password)}` }
});

export const getUsers = (offset, limit) => ({
  type: types.GET_USERS,
  method: 'GET',
  path: `/users?offset=${offset}&limit=${limit}`
})

export const signout = (body) => ({
  type: types.SIGN_OUT,
})

export const inviteUser = (body) => ({
  type: types.POST_USER,
  method: 'POST',
  path: '/invite_user',
  body,
})

/* ----- Acts ----- */

export const getActs = (offset, limit) => ({
  type: types.GET_LIST,
  method: 'GET',
  path: `/acts?offset=${offset}&limit=${limit}`
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
  path: `/users/${userId}/assign/${actId}?is_delete=true`
})

export const addAct = (body) => ({
  type: types.ADD_ACT,
  method: 'POST',
  path: '/acts',
  isMultipartUpload: true,
  body,
})

export const updateAct = ({id, ...body}) => ({
  type: types.UPDATE_ACT,
  method: 'PUT',
  path: `/acts/${id}`,
  body
})

export const deleteAct = (act) => ({
  type: types.DELETE_ACT,
  method: 'DELETE',
  path: `/acts/${act.id}`
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

export const saveAnswer = (actId, actData, answerData) => ({
  type: types.SAVE_ANSWER,
  method: 'POST',
  path: '/answers',
  body: {
      act_id:actId,
      act_data:actData,
      answer_data:answerData,
      platform: 'web'
  }
})

/*------- organizations ------*/

export const getOrganizations = (offset, limit) => ({
  type: types.GET_LIST,
  method: 'GET',
  path: `/organizations?${generateQuery({offset, limit})}`
})

export const addOrganization = (body) => ({
  type: types.ADD_ORGANIZATION,
  method: 'POST',
  path: '/organizations',
  body,
})

/*------- files ------- */

export const getFiles = (path) => ({
  type: types.GET_LIST,
  method: 'GET',
  path: `/files?${generateQuery({path})}`
})

export const postFile = (body) => ({
  type: types.POST_FILE,
  method: 'POST',
  path: `/files`,
  isMultipartUpload: true,
  body,
})

export const deleteFile = (path) => ({
  type: types.DELETE_FILE,
  method: 'DELETE',
  path: `/files?${generateQuery({path})}`,
});


export const listObjects = (parentId, parentType, name, objectType) => ({
  type: types.LIST_OBJECTS,
  method: 'GET',
  objectType,
  name,
  path: `/${objectType}?${generateQuery({parentId, parentType})}`,
});

export const getObject = (type, id) => ({
  type: types.GET_OBJECT,
  method: 'GET',
  path: `/${type}/${id}`,
});

export const addObject = (type, name, meta, options) => ({
  type: types.ADD_OBJECT,
  method: 'POST',
  path: `/${type}`,
  objectType: type,
  body: {
    name,
    metadata:JSON.stringify(meta),
    ...options,
  },
});

export const addItem = (name, meta, folderId) => (addObject('item', name, meta, {folderId}));

// Volumes
export const getCollection = (name) => ({
  type: types.GET_COLLECTION,
  method: 'GET',
  name,
  path: `/collection?text=${name}`,
});

export const getFolders = (parentId, name, parentType='collection') => ({
  type: types.LIST_OBJECTS,
  method: 'GET',
  objectType: 'folder',
  name,
  path: `/folder?${generateQuery({parentId, parentType})}`,
});

export const addFolder = (name, meta, parentId, parentType) => ({
  type: types.ADD_OBJECT,
  method: 'POST',
  path: '/folder',
  objectType: 'folder',
  body: {
    name,
    metadata:JSON.stringify(meta),
    parentId,
    parentType,
    reuseExisting: true,
  },
});

export const updateFolder = (name, meta, id) => ({
  type: types.UPDATE_OBJECT,
  method: 'PUT',
  objectType: 'folder',
  path: `/folder/${id}`,
  body: {
    name,
    metadata:JSON.stringify(meta),
  },
});

export const getItems = (parentId, name, parentType='folder') => (listObjects(parentId, parentType, 'item', 'item' ));
