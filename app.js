const http = require('http');

const routes = require('./routes');

const server = this.http.createServer(routes);

server.listen(3000);