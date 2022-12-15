import {
  Inject,
  Injectable,
  Logger as CommonLogger,
  LogLevel,
  Scope,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RequestContext } from 'nestjs-request-context';
import { v4 } from 'uuid';

const format = (...args: any[]) => {
  return args
    .map((arg) => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg);
      }
      return arg;
    })
    .filter((arg) => arg)
    .join(' ');
};

@Injectable({
  scope: Scope.TRANSIENT,
})
export class Logger {
  private context?: string;
  private levels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: CommonLogger,
  ) {}

  getTraceId() {
    const req: any = RequestContext.currentContext?.req;
    return req?.id ?? 'no-trace-id';
  }

  /**
   * Get a scoped logger with the trace ID in the log message
   * @param traceId Trace ID to be used in the log message (optional)
   * @returns A scoped logger with the trace ID in the log message
   */
  getScoped(traceId = v4(), ctx?: string) {
    const context = ctx ?? this.context;
    return {
      log: (...args: any[]) => {
        this.logger.log(format(`[${traceId}]`, ...args), context);
      },
      error: (...args: any[]) => {
        this.logger.error(format(`[${traceId}]`, ...args), context);
      },
      warn: (...args: any[]) => {
        this.logger.warn(format(`[${traceId}]`, ...args), context);
      },
      debug: (...args: any[]) => {
        this.logger.debug(format(`[${traceId}]`, ...args), context);
      },
      verbose: (...args: any[]) => {
        this.logger.verbose(format(`[${traceId}]`, ...args), context);
      },
      setContext: (context: string) => {
        return this.getScoped(traceId, context);
      },
    };
  }

  setContext(context: string) {
    this.context = context;
  }

  log(...args: any[]) {
    if (!this.levels.includes('log')) return;
    const rid = this.getTraceId();
    const msg = rid ? `[${rid}]` : '';
    this.logger.log(format(msg, ...args), this.context);
  }

  error(...args: any[]) {
    if (!this.levels.includes('error')) return;
    this.logger.error(format(...args), this.context);
  }

  warn(...args: any[]) {
    if (!this.levels.includes('warn')) return;
    this.logger.warn(format(...args), this.context);
  }

  debug(...args: any[]) {
    if (!this.levels.includes('debug')) return;
    this.logger.debug(format(...args), this.context);
  }

  verbose(...args: any[]) {
    if (!this.levels.includes('verbose')) return;
    this.logger.log(format(...args), this.context);
  }

  setLogLevels(levels: LogLevel[]) {
    this.levels = levels;
    if (!this.levels.includes('log')) this.levels.push('log');
  }
}
