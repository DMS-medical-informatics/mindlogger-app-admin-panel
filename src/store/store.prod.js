import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import api from '../middleware/api'
import auth from '../middleware/auth'
import rootReducer from '../reducers'
import createHistory from 'history/createBrowserHistory'

export const history = createHistory()

const configureStore = preloadedState => createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunk, api, auth, routerMiddleware(history))
)

export default configureStore