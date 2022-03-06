const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorHandle = require('./errorHandle.js');
const PORT = process.env.PORT || 3005;

let todos = [
    {
        id: uuidv4(),
        title: '今天要刷牙',
    },
];

const requestListener = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json',
    };
    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    });

    if (req.url === '/todos' && req.method === 'GET') {
        res.writeHead(200, headers);
        res.write(
            JSON.stringify({
                status: 'success',
                data: todos,
            })
        );
        res.end();
    } else if (req.url === '/todos' && req.method === 'POST') {
        req.on('end', () => {
            try {
                const { title } = JSON.parse(body);
                if (!title) throw { statusCode: 400, errorMessage: 'title 為必填' };

                todos.push({
                    id: uuidv4(),
                    title,
                });
                res.writeHead(200, headers);
                res.write(
                    JSON.stringify({
                        status: 'success',
                        data: todos,
                    })
                );
                res.end();
            } catch ({ statusCode, errorMessage }) {
                errorHandle(res, statusCode, errorMessage);
            }
        });
    } else if (req.url === '/todos' && req.method === 'DELETE') {
        todos.length = 0;
        res.writeHead(200, headers);
        res.write(
            JSON.stringify({
                status: 'success',
                data: todos,
            })
        );
        res.end();
    } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
        const id = req.url.split('/').pop();

        try {
            const index = todos.findIndex((item) => id === item.id);
            if (index === -1) throw { statusCode: 400, errorMessage: '找不到此 id' };

            todos.splice(index, 1);
            res.writeHead(200, headers);
            res.write(
                JSON.stringify({
                    status: 'success',
                    data: todos,
                })
            );
            res.end();
        } catch ({ statusCode, errorMessage }) {
            errorHandle(res, statusCode, errorMessage);
        }
    } else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
        req.on('end', () => {
            try {
                if (!body) throw { statusCode: 400, errorMessage: 'title 為必填' };
                const { title } = JSON.parse(body);
                if (!title) throw { statusCode: 400, errorMessage: 'title 為必填' };

                const id = req.url.split('/').pop();
                const index = todos.findIndex((item) => item.id === id);
                if (index === -1) throw { statusCode: 400, errorMessage: '找不到此 id' };

                todos[index].title = title;

                res.writeHead(200, headers);
                res.write(
                    JSON.stringify({
                        status: 'success',
                        data: todos,
                    })
                );
                res.end();
            } catch ({ statusCode, errorMessage }) {
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
