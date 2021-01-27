//Load express module with `require` directive
require('dotenv').config()
const port = process.env.PORT || 3000;
var express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const winston = require('./config/winston');


const app = express();

const routes = require('./routes');
const models = require('./models');
const server = require('http').Server(app);

const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'token, Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, x-chat-id');
  if (req.method === 'OPTIONS') {
    res.send(204);
  } else {
    next();
  }
};

app.use(morgan('combined', { stream: winston.stream }));
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

models.sequelize.sync().then(() => {
  server.listen(port, () => {});
  server.on('error', onError);
  server.on('listening', onListening);
});

/*
 * Event listener for HTTP server "error" event.
*/
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/*
 * Event listener for HTTP server "listening" event.
*/
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`rxn api still alive though ${bind}`); // eslint-disable-line
}


routes(app);

module.exports = {
  app,
};