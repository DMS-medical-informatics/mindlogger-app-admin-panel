import * as types from '../constants/actionTypes';

const entities = (state = {}, action) => {
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
                    auth: action.response.user
                }
            case types.CHANGE_PROFILE:
                return {
                    ...state,
                    auth: {...state.auth, ...action.response.user}
                }
            case types.SIGN_OUT:
                return {
                    ...state,
                    auth: false
                }
            case types.POST_FILE:
                return {
                    ...state
                }
            
            default:
              return {
                  ...state,
                  ...action.response
              }

        }
        
    }
    
    return state
}

export default entities;