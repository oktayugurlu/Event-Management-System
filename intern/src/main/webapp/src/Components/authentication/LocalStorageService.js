
export function getCreatedItemsByUser(){
    if(localStorage.getItem("createdItems")!==null)
        return JSON.parse(localStorage.getItem("createdItems"));
    else
        return [];
}

export function setCreatedItems(createdEventsList){
    localStorage.setItem("createdItems", JSON.stringify(createdEventsList));
}

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