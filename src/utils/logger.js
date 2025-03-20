import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

// Current log level
const currentLogLevel = process.env.LOG_LEVEL || LOG_LEVELS.INFO;

// Log level priority
const LOG_LEVEL_PRIORITY = {
  [LOG_LEVELS.ERROR]: 0,
  [LOG_LEVELS.WARN]: 1,
  [LOG_LEVELS.INFO]: 2,
  [LOG_LEVELS.DEBUG]: 3
};

// Check if log level should be logged
const shouldLog = (level) => {
  return LOG_LEVEL_PRIORITY[level] <= LOG_LEVEL_PRIORITY[currentLogLevel];
};

// Format log message
const formatLogMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaString = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
  return `[${timestamp}] [${level}] ${message} ${metaString}`.trim() + '\n';
};

// Write log to file
const writeToFile = (message) => {
  const date = new Date().toISOString().split('T')[0];
  const logFile = path.join(logsDir, `${date}.log`);
  
  fs.appendFileSync(logFile, message);
};

// Log methods
export const error = (message, meta = {}) => {
  if (shouldLog(LOG_LEVELS.ERROR)) {
    const logMessage = formatLogMessage(LOG_LEVELS.ERROR, message, meta);
    console.error(logMessage);
    writeToFile(logMessage);
  }
};

export const warn = (message, meta = {}) => {
  if (shouldLog(LOG_LEVELS.WARN)) {
    const logMessage = formatLogMessage(LOG_LEVELS.WARN, message, meta);
    console.warn(logMessage);
    writeToFile(logMessage);
  }
};

export const info = (message, meta = {}) => {
  if (shouldLog(LOG_LEVELS.INFO)) {
    const logMessage = formatLogMessage(LOG_LEVELS.INFO, message, meta);
    console.info(logMessage);
    writeToFile(logMessage);
  }
};

export const debug = (message, meta = {}) => {
  if (shouldLog(LOG_LEVELS.DEBUG)) {
    const logMessage = formatLogMessage(LOG_LEVELS.DEBUG, message, meta);
    console.debug(logMessage);
    writeToFile(logMessage);
  }
};

export default {
  error,
  warn,
  info,
  debug
};
