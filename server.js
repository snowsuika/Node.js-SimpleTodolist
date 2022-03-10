const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorHandle = require('./common/errorHandle.js');
const successHandle = require('./common/successHandle.js');
const headers = require('./common/headers.js');
const data = require('./data/data.js');
const PORT = process.env.PORT || 3005;

const requestListener = (req, res) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));

    if (req.url === '/todos' && req.method === 'GET') {
        successHandle(res);
    } else if (req.url === '/todos' && req.method === 'POST') {
        req.on('end', () => {
            try {
                const { title } = JSON.parse(body);
                if (!title) throw { statusCode: 400, errorMessage: 'title 為必填' };
                data.push({
                    id: uuidv4(),
                    title,
                });
                successHandle(res);
            } catch ({ statusCode = 400, errorMessage = '' }) {
                errorHandle(res, statusCode, errorMessage);
            }
        });
    } else if (req.url === '/todos' && req.method === 'DELETE') {
        try {
            data.length = 0;
            successHandle(res);
        } catch ({ statusCode = 400, errorMessage = '' }) {
            errorHandle(res, statusCode, errorMessage);
        }
    } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
        const id = req.url.split('/').pop();

        try {
            const index = data.findIndex((item) => id === item.id);
            if (index === -1) throw { statusCode: 400, errorMessage: '找不到此 id' };

            data.splice(index, 1);
            successHandle(res);
        } catch ({ statusCode = 400, errorMessage = '' }) {
            errorHandle(res, statusCode, errorMessage);
        }
    } else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
        req.on('end', () => {
            try {
                const id = req.url.split('/').pop();
                const index = data.findIndex((item) => item.id === id);
                const { title } = JSON.parse(body);

                if (index === -1) throw { statusCode: 400, errorMessage: '找不到此 id' };
                if (!title) throw { statusCode: 400, errorMessage: 'title 為必填' };

                data[index].title = title;

                successHandle(res);
            } catch ({ statusCode = 400, errorMessage = '' }) {
                errorHandle(res, statusCode, errorMessage);
            }
        });
    } else if (req.method === 'OPTIONS') {
        // for 預檢請求
        res.writeHead(200, headers);
        res.end();
    } else {
        errorHandle(res, 404, '查無路由');
    }
};

const server = http.createServer(requestListener);
server.listen(PORT);
