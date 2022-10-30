export default async function prepareHeaders(
    headers: Headers,
    { getState }: { getState: () => any },
) {
    let token = getState().auth.token || '';
    console.log('headers token:', token);
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
}
