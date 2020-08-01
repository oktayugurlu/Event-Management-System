export function setJwsToken(token){
    localStorage.setItem("Authorization", token);
}
export function getJwsToken(){
    return localStorage.getItem("Authorization");
}

export function setIsAuthorized(isAuthorized) {
    localStorage.setItem("isAuthorized",isAuthorized );
}

export function isAuthorized() {
    return localStorage.getItem("isAuthorized");
}

export function setUsername(username){
    localStorage.setItem("username", username);
}
export function getUsername(){
    return localStorage.getItem("username");
}