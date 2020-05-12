import { AsuraHandler } from './Types';
import _ from 'lodash';

export const processAsuraHandlers = (handlers: AsuraHandler[]): object => {
    return _.reduce(
        handlers, (memo: object, handler: AsuraHandler) => {
            memo[handler.type] = handler.handler;
            return memo
        }, {},
    )
}