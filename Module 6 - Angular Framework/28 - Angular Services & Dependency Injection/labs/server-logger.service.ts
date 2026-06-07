import { Injectable } from '@angular/core';
import { LoggerConfig } from './logger.config';

@Injectable({
  providedIn: 'root'
})
export class ServerLoggerService implements LoggerConfig {
  log(msg: string): void {
    // TODO: Simulate sending log to server endpoint (e.g. print with [Server Log])
    console.log(`[Server Log POST]: ${msg}`);
  }

  error(msg: string): void {
    // TODO: Simulate sending error to server endpoint (e.g. print with [Server Error])
    console.error(`[Server Error POST]: ${msg}`);
  }
}
