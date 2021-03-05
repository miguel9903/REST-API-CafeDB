const { Server } = require('http');

require('dotenv').config();
const RestServer = require('./models/server');

const server = new RestServer();
server.listen();