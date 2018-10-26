/*
    Functions for working with numbers
*/

import {Logger} from './logger';

export class NumberRatchet {
    private static MAX_LEADING_ZEROS_FORMAT_LENGTH = 1000; // Because really, why?

    public static leadingZeros(val: any, size: number): string {
        let pad = '0000';
        if (size > NumberRatchet.MAX_LEADING_ZEROS_FORMAT_LENGTH) {
            throw 'Cannot format number that large (max length is ' + NumberRatchet.MAX_LEADING_ZEROS_FORMAT_LENGTH + ')';
        }
        while (pad.length < size) {
            pad = pad + pad; // It won't take that long to get there
        }

        return (pad + String(val)).slice(-1 * size);
    }


    public static between(test: number, p1: number, p2: number) {
        return ((test >= p1 && test <= p2) || (test >= p2 && test <= p1));
    }

    // If its a number, leave it alone, if its a string, parse it, anything else, use the default
    public static safeNumber(input: any, ifNotNumber: number = null): number {
        let rval: number = null;
        if (input != null) {
            let type: string = typeof input;
            if (type == 'number') {
                rval = input;
            }
            else if (type == 'string') {
                rval = Number.parseFloat(input);
            }
            else {
                Logger.warn('Value is of type %s, returning default', type);
                rval = ifNotNumber;
            }
        }
        return rval;
    }

}

