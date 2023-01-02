const url = process.env.REACT_APP_API_URL;

function apiBuidRequestInit(accessToken, method, body) {
    let requestInit = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(body),
    };

    if (body)
        requestInit = { ...requestInit, body: JSON.stringify(body) };

    return requestInit;
}


export async function authenticateUser(accessToken) {
    const request = await fetch(url + 'GoogleAuth', apiBuidRequestInit(accessToken, "POST"));
    return await request.json();
}