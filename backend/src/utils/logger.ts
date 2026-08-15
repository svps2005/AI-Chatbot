import { env } from '../config/env';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private logLevel: LogLevel;

  constructor(logLevel: LogLevel = 'info') {
    this.logLevel = logLevel as LogLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['error', 'warn', 'info', 'debug'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const targetLevelIndex = levels.indexOf(level);
    return targetLevelIndex <= currentLevelIndex;
  }

  private format(entry: LogEntry): string {
    return `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${
      entry.data ? ' ' + JSON.stringify(entry.data) : ''
    }`;
  }

  error(message: string, data?: any): void {
    if (this.shouldLog('error')) {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: 'error',
        message,
        data,
      };
      console.error(this.format(entry));
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog('warn')) {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: 'warn',
        message,
        data,
      };
      console.warn(this.format(entry));
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog('info')) {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: 'info',
        message,
        data,
      };
      console.log(this.format(entry));
    }
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog('debug')) {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: 'debug',
        message,
        data,
      };
      console.debug(this.format(entry));
    }
  }
}

export const logger = new Logger(env.logLevel as LogLevel);
