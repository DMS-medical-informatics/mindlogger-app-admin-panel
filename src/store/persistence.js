export default {
    entities: {
        auth: window.localStorage.auth ? JSON.parse(window.localStorage.auth) : {}, 
        users: window.localStorage.users ? JSON.parse(window.localStorage.users) : [],
    }
}
