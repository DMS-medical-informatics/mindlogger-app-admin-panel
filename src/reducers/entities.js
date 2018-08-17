import * as types from '../constants/actionTypes';

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
                    auth: {...state.auth, ...action.response.user}
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
            case types.GET_FOLDER:
                {
                    let folder = state.folder || {};
                    folder[action.name.toLowerCase()] = action.response;
                    return {
                        ...state,
                        folder,
                    }
                }
            
            default:
              return {
                  ...state,
              }

        }
        
    }
    
    return state
}

export default entities;