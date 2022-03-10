const { v4: uuidv4 } = require('uuid');
const data = [
    {
        id: uuidv4(),
        title: '今天要刷牙',
    },
];

module.exports = data;
