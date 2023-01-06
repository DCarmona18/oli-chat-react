const url = process.env.REACT_APP_API_URL;

function apiBuidRequestInit(accessToken, method, body, extraHeaders) {
    let requestInit = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            ...extraHeaders
        },
        body: JSON.stringify(body),
    };

    if (body)
        requestInit = { ...requestInit, body: JSON.stringify(body) };

    return requestInit;
}


export async function authenticateUser(accessToken, authType) {
    const request = await fetch(url + 'Auth', apiBuidRequestInit(accessToken, "POST", {}, { 'x-auth-type': authType }));
    return await request.json();
}