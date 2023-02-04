//Load express module with `require` directive
const port = process.env.PORT || 3000;
var express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const models = require("./models");
const Sentry = require("@sentry/node");
const bodyParser = require("body-parser");
const Tracing = require("@sentry/tracing");
const server = require("http").Server(app);

require("dotenv").config();

const allowedOrigins = [
  "http://localhost:3000",
  "https://lab-conginicion.web.app",
];

app.use(morgan("tiny", { stream: winston.stream }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin: " +
          origin;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

routes(app);

if (process.env.NODE_ENV !== "development") {
  Sentry.init({
    dsn: "https://3a80d5633da549809ca6c855efe27334@o416448.ingest.sentry.io/4504624097722368",
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });

  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());

  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());

  // Optional fallthrough error handler
  app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
  });
} else {
  app.use(function onError(error, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    console.log(error);
    res.status(500).send({ error });
  });
}

models.sequelize.sync().then(() => {
  server.listen(port, () => {});
  server.on("error", onError);
  server.on("listening", onListening);
});

/*
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
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
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Lab Server api still alive though ${bind}`); // eslint-disable-line
}

module.exports = {
  app,
};
