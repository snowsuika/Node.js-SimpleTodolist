const headers = require('./headers.js');

function errorHandle(res, statusCode = 400, errorMessage = '') {
    if (!errorMessage) {
        switch (statusCode) {
            case 400:
                errorMessage = '錯誤的請求，格式不正確';
                break;
            case 401:
                errorMessage = '身份不正確，請重新驗證';
                break;
            case 403:
                errorMessage = '您沒有權限訪問該資源';
                break;
        }
    }

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
