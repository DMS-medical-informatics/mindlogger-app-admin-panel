import * as types from '../actions/actionTypes';

const entities = (state = {}, action) => {
    if (action.type === types.SIGN_OUT) {
        return {
            auth: false
        }
    }
    if(action.status === 'ERRORED' && action.error.error && action.error.error.status === 401) {
        return {}
    }
    switch (action.type) {
        case types.UPDATE_SELF:
            let auth = {...state.auth, ...action.data}
            return {
                ...state,
                auth ,
            }
        case types.SET_DATA:
            return {
                ...state,
                ...action.data,
            }
        case types.SET_DATA_OBJECT:
        {
            let data = state.data || {};
            data[action.object._id] = action.object;
            return {
                ...state,
                data,
            }
        }
        default:
            break;
    }
    
    if (action.path && action.method && action.status === 'COMPLETE') {
        switch (action.type) {
            case types.SIGN_IN:
            case types.SIGN_UP:
                return {
                    ...state,
                    auth: action.response.authToken,
                    self: action.response.user,
                }
            case types.CHANGE_PROFILE:
                return {
                    ...state,
                    self: action.response
                }
            case types.POST_FILE:
                return {
                    ...state
                }
            case types.GET_COLLECTION:
                {
                    let collection = state.collection || {};
                    collection[action.name.toLowerCase()] = action.response[0];
                    return {
                        ...state,
                        collection,
                    }
                }
                break;
            case types.LIST_OBJECTS:
                {
                    let data = state[action.objectType] || {};
                    data[action.name] = action.response;
                    let newState = {
                        ...state,
                    }
                    newState[action.objectType] = data;
                    return newState;
                }
            case types.GET_OBJECT:
                {
                    let data = state.data || {};
                    data[action.objectPath] = action.response;
                    return {
                        ...state,
                        data,
                    }
                }
            case types.GET_NAMES_HASH:
                {
                    let objects = state.objects || {};
                    let key = `${action.parentType}/${action.parentId}`;
                    let dict = objects[key] || {};
                    let arr = action.response;
                    arr.forEach(obj => {
                        dict[`${action.objectType}/${obj.name}`] = obj;
                    });
                    objects[key] = dict;
                    return {
                        ...state,
                        objects,
                    }
                }
            case types.GET_OBJECTS_HASH:
                {
                    let dict = state[action.group] || {};
                    let arr = action.response;
                    arr.forEach(obj => {
                        dict[obj.name] = obj;
                    });
                    let newState = {
                        ...state,
                    }
                    newState[action.group] = dict;
                    return newState;
                }
            default:
              return state;

        }
        
    }
    
    return state
}

export default entities;