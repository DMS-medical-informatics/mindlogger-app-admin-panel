import * as types from '../constants/actionTypes';

const mergeEntities = (state, action) => {
    return {
        user: {
            ...state.user,
            ...action.response.user
        },
    }
}

const entities = (state = {}, action) => {
    switch (action.type) {
        case types.UPDATE_SELF:
            let auth = {...state.auth, ...action.data}
            return {
                ...state,
                auth ,
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
            case types.SIGN_OUT:
                return {
                    ...state,
                    auth: false
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