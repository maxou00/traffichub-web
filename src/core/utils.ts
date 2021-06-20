export function isDev(){
    let host = window.location.hostname;
    if(host.startsWith('localhost') || host.startsWith('test')){
        return true;
    }
    return false;
}
