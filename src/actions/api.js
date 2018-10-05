import * as types from './actionTypes';
function generateQuery(params) {
  if (params == undefined) return ""
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
  body: {
    ...body,
    admin: true,
  },
});

export const changeProfile = (id, body) => ({
  type: types.CHANGE_PROFILE,
  method: 'PUT',
  path: `/user/${id}`,
  body,
});

export const changePassword = (id, body) => ({
  type: types.CHANGE_PASSWORD,
  method: 'PUT',
  path: `/user/${id}/password`,
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

export const signout = (body) => ({
  type: types.SIGN_OUT,
})

export const inviteUser = (body, meta) => ({
  type: types.POST_USER,
  method: 'POST',
  path: '/user',
  body: {
    ...body,
    metadata:JSON.stringify(meta),
    admin: true,
  },
})

export const setUserTemporary = (email) => ({
  type: types.PUT_USER,
  method: 'PUT',
  path: '/user/password/temporary',
  body: { email }
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
  path: `/group?${generateQuery({offset, limit})}`
})

export const addOrganization = (body) => ({
  type: types.ADD_ORGANIZATION,
  method: 'POST',
  path: '/group',
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

export const getObject = (objectPath) => ({
  type: types.GET_OBJECT,
  method: 'GET',
  objectPath,
  path: `/${objectPath}`,
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

export const updateObject = (type, id, name, meta, options={}) => ({
  type: types.UPDATE_OBJECT,
  method: 'PUT',
  objectType: type,
  path: `/${type}/${id}`,
  body: {
    ...options,
    name,
    metadata:JSON.stringify(meta),
  },
});

export const deleteObject = (id, type) => ({
  type: types.DELETE_OBJECT,
  method: 'DELETE',
  path: `/${type}/${id}`
})

export const addItem = (name, meta, folderId) => (addObject('item', name, meta, {folderId}));
export const updateItem = (id, name, meta) => (updateObject('item', id, name, meta));

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

export const addFolder = (name, meta, parentId, parentType, reuseExisting = true) => ({
  type: types.ADD_OBJECT,
  method: 'POST',
  path: '/folder',
  objectType: 'folder',
  body: {
    name,
    metadata:JSON.stringify(meta),
    parentId,
    parentType,
    reuseExisting,
  },
});

export const updateFolder = (id, name, meta) => ({
  type: types.UPDATE_OBJECT,
  method: 'PUT',
  objectType: 'folder',
  path: `/folder/${id}`,
  body: {
    name,
    metadata:JSON.stringify(meta),
  },
});

export const updateFolderMeta = (id, meta) => ({
  type: types.UPDATE_OBJECT,
  method: 'PUT',
  objectType: 'folder',
  path: `/folder/${id}`,
  body: {
    metadata:JSON.stringify(meta),
  },
});

export const uploadFile = (name, fileObject, parentType, parentId) => ({
  type: types.ADD_OBJECT,
  method: 'POST',
  path: `/file?${generateQuery({
    parentId,
    parentType,
    name,
    size:fileObject.size,
    mimeType: fileObject.type,
  })}`,
  isUpload: true, 
  body: fileObject,
  extraHeaders: { 'Content-Type': fileObject.type }
})

export const getItems = (parentId) => ({
  type: types.GET_NAMES_HASH,
  method: 'GET',
  objectType: 'item',
  parentId,
  parentType: 'folder',
  path: `/item?${generateQuery({folderId:parentId})}`,
});

export const getFoldersDict = (objectType, parentId, parentType='folder') => ({
  type: types.GET_NAMES_HASH,
  method: 'GET',
  objectType,
  parentId,
  parentType: 'folder',
  path: `/${objectType}?${generateQuery({parentId, parentType})}`,
});

export const getUsers = (params) => ({
  type: types.GET_OBJECTS_HASH,
  method: 'GET',
  group: 'users',
  path: `/user?${generateQuery(params)}`,
})

export const getObjectsById = (name, group, params={}) => ({
  type: types.GET_OBJECTS_HASH,
  method: 'GET',
  group,
  path: `/${name}?${generateQuery(params)}`,
})

export const copyObject = (objectId, objectType, parentId, parentType) => ({
  type: types.ADD_OBJECT,
  method: 'POST',
  path: `/${objectType}/${objectId}/copy?${generateQuery({parentId, parentType})}`,
  body: {
    reuseExisting: true,
  }
})

export const getPath = (path, query) => ({
  type: types.GET_PATH,
  method: 'GET',
  path: `/${path}?${generateQuery(query)}`,
})