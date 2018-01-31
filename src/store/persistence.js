export default {
    entities: {
        auth: window.localStorage.auth ? JSON.parse(window.localStorage.auth) : {}
    }
}