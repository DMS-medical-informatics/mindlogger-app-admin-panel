import { API_HOST } from '../constants';
import * as types from '../actions/actionTypes';
import objectToFormData from 'object-to-formdata';

export default store => next => action => {
    if ((!action.method && !action.path) || action.status) return next(action)

    let { path } = action;
    const { method, type, body } = action;
    const state = store.getState();
    let accessToken;
    if (state.entities.auth) {
        accessToken = state.entities.auth.token;
    }

    if (!path || !method || !type) {
        throw new Error('Specify a path, method and type.')
    }

    if (typeof path === 'function') {
        path = path(state);
    }
    // replace endpoint generics such as 'user/me'
    path = endpointGenerics(state, path);

    // fire off request action to reducer
    next({...action, status: 'REQUESTED' });

    // make the request
    return makeRequest(method, path, body, accessToken, action)
        .then(response => {
            store.dispatch({...action, response, status: 'COMPLETE' });
            return Promise.resolve(response);
        })
        .catch(error => {
            store.dispatch({...action, error, status: 'ERRORED' });
            return Promise.reject(error);
        });
}

export const makeRequest = (method, path, data, accessToken, {isMultipartUpload, isJson, extraHeaders, isUpload}) => {
    let headers = new Headers(extraHeaders || {});
    if (accessToken) {
        headers.set("Girder-Token", accessToken);
    }
    let body = data;
    if (!isUpload) {
        if (!isMultipartUpload && isJson) {
            headers.set("Content-Type", "application/json; charset=utf-8");
            body = JSON.stringify(data);
        } else if (!isJson && method !== 'GET') {
            body = objectToFormData(data);
        }
    }

    console.log(headers);
    
    return fetch(`${API_HOST}${path}`, {
            mode: 'cors',
            body,
            method,
            headers
        })
        .then(response => {
            const status = response.status;
            try {
                return response.json().then(json => {
                    return status === 200 ? Promise.resolve(json) : Promise.reject(json);
                })
            } catch (error) {
                Promise.reject(error);
            }
            
        });
}

const endpointGenerics = (state, path) => {
    let newPath = path;
    console.log(state);
    if (state.entities.auth && state.entities.auth.id) {
        newPath = newPath.replace(/user\/me/, `user/${state.entities.auth.id}`);
    }
    return newPath;
}