const headers = require('./headers.js');
const data = require('../data/data.js');

function successHandle(res) {
    res.writeHead(200, headers);
    res.write(
        JSON.stringify({
            status: 'success',
            data,
        })
    );
    res.end();
}

module.exports = successHandle;
