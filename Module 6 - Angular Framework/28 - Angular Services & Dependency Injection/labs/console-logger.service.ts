import { Injectable } from '@angular/core';
import { LoggerConfig } from './logger.config';

@Injectable({
  providedIn: 'root'
})
export class ConsoleLoggerService implements LoggerConfig {
  log(msg: string): void {
    // TODO: Log message to the console with console.log
    console.log(`[Console Log]: ${msg}`);
  }

  error(msg: string): void {
    // TODO: Log error to the console with console.error
    console.error(`[Console Error]: ${msg}`);
  }
}
