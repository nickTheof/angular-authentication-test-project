require("winston-daily-rotate-file");
require("winston-mongodb");
const winston = require("winston");
const { format, transports } = require("winston");
const { combine, timestamp, json, colorize, printf } = format;

const formatDefault = combine(
  timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
  json()
);

const logger = winston.createLogger({
  format: formatDefault,
});

// Create different MongoDB transports for development, production and testing env
const devMongoDBTransport = new transports.MongoDB({
  level: "info",
  db: process.env.MongoDB_URI,
  collection: "development_backend_logs",
});

const prodMongoDBTransport = new transports.MongoDB({
  level: "info",
  db: process.env.MongoDB_URI,
  collection: "production_backend_logs",
});

const testingMongoDBTransport = new transports.MongoDB({
  level: "info",
  db: process.env.MongoDB_URI_TESTING,
  collection: "testing_backend_logs",
});

// Create a console transport for development environment
const devConsoleTransport = new transports.Console({
  format: combine(
    colorize(),
    printf(
      ({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`
    )
  ),
});

// Create a daily rotate file transport for production environment
const fileRotateTransport = new transports.DailyRotateFile({
  filename: "./logs/rotate-%DATE%.log",
  datePattern: "DD-MM-YYYY",
  maxFiles: "7d",
  maxSize: "10m",
});

// Create a file transport for only warn level logs in production
const criticalProdLogsFileTransport = new transports.File({
  filename: "./logs/error.log",
  level: "error",
});

// Create File transport for exceptions handler in production
const exceptionsLogsFileTransport = new transports.File({
  filename: "./logs/exceptions.log",
});

// Create File trnasport for rejections handler in production
const rejectionsLogsFileTransport = new transports.File({
  filename: "./logs/rejections.log",
});

// Add transports based on NODE_ENV
if (process.env.NODE_ENV === "development") {
  logger.add(devConsoleTransport);
  logger.add(devMongoDBTransport);
} else if (process.env.NODE_ENV === "testing") {
  logger.add(testingMongoDBTransport);
} else if (process.env.NODE_ENV === "production") {
  logger.add(prodMongoDBTransport);
  logger.add(fileRotateTransport);
  logger.add(criticalProdLogsFileTransport);
  logger.exceptions.handle(exceptionsLogsFileTransport);
  logger.rejections.handle(rejectionsLogsFileTransport);
}

module.exports = logger;
