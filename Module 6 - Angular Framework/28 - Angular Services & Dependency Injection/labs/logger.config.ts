import { InjectionToken } from '@angular/core';

export interface LoggerConfig {
  log(msg: string): void;
  error(msg: string): void;
}

// TODO: Create an InjectionToken named 'APP_LOGGER' representing the LoggerConfig interface
// export const APP_LOGGER = new InjectionToken<LoggerConfig>('app.logger.token');
