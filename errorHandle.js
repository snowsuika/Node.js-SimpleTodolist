function errorHandle(res, statusCode, errorMessage) {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json',
    };

    res.writeHead(statusCode, headers);
    res.write(
        JSON.stringify({
            status: 'error',
            message: errorMessage,
        })
    );
    res.end();
}

module.exports = errorHandle;
