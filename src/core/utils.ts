export function isDev(){
    let host = window.location.hostname;
    if(host.startsWith('localhost')){
        return true;
    }
    return false;
}

export function isStaging(){
    let host = window.location.hostname;
    if(host.startsWith('test')){
        return true;
    }
    return false;
}
