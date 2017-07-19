import { config } from './transform';

export function log(message?: any, ...optionalParams: any[]) {
    if(config.logging) console.log(message, optionalParams);
}