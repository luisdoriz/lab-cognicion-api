const appRoot = require("app-root-path");
const { createLogger, format, transports } = require("winston");

const level = process.env.LOG_LEVEL || "debug";

const formatParams = (info) => {
  const { timestamp, levelInfo, message, ...args } = info;
  const ts = timestamp.slice(0, 19).replace("T", " ");
  return `${ts} ${levelInfo}: ${message} ${
    Object.keys(args).length ? JSON.stringify(args, "", "") : ""
  }`;
};

const productionFormat = format.combine(
  format.timestamp(),
  format.align(),
  format.printf(formatParams)
);

const options = {
  file: {
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = createLogger({
  level,
  format: productionFormat,
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console),
  ],
  exitOnError: false,
});

logger.stream = {
  write: (message) => {
    logger[level](message);
  },
};

module.exports = logger;
