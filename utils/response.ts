
export function failure400 (body: any) {
    return {
        headers: {
            ...buildResponse(400, 'Not a WebSocket-over-HTTP request\n').headers,
            'Content-Type': 'text/plain'
        },
        body
    }
}

export function success(body: any) {
    return buildResponse(200, body);
}

export function failure(body: any) {
    return buildResponse(500, body);
}

function buildResponse(statusCode: number, body:any) {
    return {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify(body)
    };
}