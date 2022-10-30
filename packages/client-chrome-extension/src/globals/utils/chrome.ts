export function localGet(key: string, cb: (data: Record<string, any>) => void) {
    try {
        chrome.storage.local.get(key, (data: Record<string, any>) => {
            cb && cb(data);
        });
    } catch (error) {}
}

export function cookieGet(
    details: { name: string; url: string },
    cb: (cookie: Record<string, string>) => void,
) {
    try {
        chrome.cookies.get(details, (cookie: Record<string, string>) => {
            cb && cb(cookie);
        });
    } catch (error) {
        console.log('error chrome', error);
    }
}
