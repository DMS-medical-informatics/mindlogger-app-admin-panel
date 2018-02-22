import { API_HOST } from '../constants';

export default store => next => action => {
    if ((!action.method && !action.path) || action.status) return next(action)

    let { path } = action;
    const { method, type, body, isMultipartUpload } = action;
    const state = store.getState();
    let accessToken;
    if (state.entities.auth) {
        accessToken = state.entities.auth.access_token;
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
    return makeRequest(method, path, body, accessToken, isMultipartUpload)
        .then(response => {
            store.dispatch({...action, response, status: 'COMPLETE' });
            return Promise.resolve(response);
        })
        .catch(error => {
            store.dispatch({...action, error, status: 'ERRORED' });
            return Promise.reject(error);
        });
}

export const makeRequest = (method, path, body, accessToken, isMultipartUpload) => {
    const headers = new Headers({
        "access_token": accessToken,
    });
    if (!isMultipartUpload) {
        headers.set("Content-Type", "application/json; charset=utf-8");
    }
    return fetch(`${API_HOST}${path}`, {
            mode: 'cors',
            body: isMultipartUpload ? body : JSON.stringify(body),
            method,
            headers
        })
        .then(response => {
            const status = response.status;
            try {
                return response.json();
            } catch (error) {
                return {};
            }
            
        })
        .then(json => {
            return json.success ? Promise.resolve(json) : Promise.reject(json);
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