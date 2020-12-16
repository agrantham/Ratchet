/*
    Functions for working with strings
*/

export class StringRatchet {
  // % isn't technically reserved but its still a pain in the butt
  public static RFC_3986_RESERVED = ['!', '*', "'", '(', ')', ';', ':', '@', '&', '=', '+', '$', ',', '/', '?', '#', '[', ']', '%'];

  public static createType4Guid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  public static createRandomHexString(len = 10): string {
    let r = '';
    for (let i = 0; i < len; i++) {
      r += Math.floor(Math.random() * 16).toString(16);
    }
    return r;
  }

  public static canonicalize(value: string): string {
    let rval = value ? value.toLowerCase() : '';

    rval = rval.replace(' ', '-');
    StringRatchet.RFC_3986_RESERVED.forEach((s) => {
      rval = rval.replace(s, '');
    });

    return rval;
  }

  // Taken from https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
  public static formatBytes(bytes: number, decimals = 2): string {
    if (bytes == 0) return '0 Bytes';
    const k = 1024,
      dm = decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  // Converts anything that isn't a string to a string
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public static safeString(input: any): string {
    let rval: string = null;
    if (input != null) {
      const type: string = typeof input;
      if (type == 'string') {
        rval = input;
      } else {
        rval = String(input);
      }
    }
    return rval;
  }

  public static stringContainsOnlyNumbers(input: string): boolean {
    const rval: boolean = /^[0-9]+$/.test(input);
    return rval;
  }
  public static stringContainsOnlyAlphanumeric(input: string): boolean {
    const rval: boolean = /^[0-9a-zA-Z]+$/.test(input);
    return rval;
  }
  public static stringContainsOnlyHex(input: string): boolean {
    const rval: boolean = /^[0-9a-fA-F]+$/.test(input);
    return rval;
  }
  public static stringContainsOnly(inVal: string, validCharsIn: string): boolean {
    const input: string = !inVal ? '' : inVal;
    const validChars: string = !validCharsIn ? '' : validCharsIn;
    let rval = true;

    for (let i = 0; i < input.length && rval; i++) {
      rval = validChars.indexOf(input.charAt(i)) >= 0;
    }
    return rval;
  }

  public static obscure(input: string, prefixLength = 2, suffixLength = 2): string {
    if (!input) {
      return input;
    }
    const len: number = input.length;
    let pl: number = prefixLength;
    let sl: number = suffixLength;

    while (len > 0 && len < pl + sl + 1) {
      pl = Math.max(0, pl - 1);
      sl = Math.max(0, sl - 1);
    }
    const rem = len - (pl + sl);

    let rval = '';
    rval += input.substring(0, pl);
    // Yeah, I know.  I'm in a rush here
    for (let i = 0; i < rem; i++) {
      rval += '*';
    }
    rval += input.substring(len - sl);
    return rval;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public static leadingZeros(inVal: any, size: number): string {
    const pad = '00000000000000000000000000000000000000000000000000';
    let negative = false;
    let sVal = String(inVal);
    if (sVal.startsWith('-')) {
      negative = true;
      sVal = sVal.substring(1);
    }

    if (size > pad.length) {
      throw new Error('Cannot format number that large');
    }

    let rval: string = (pad + sVal).slice(-1 * size);
    if (negative) {
      rval = '-' + rval;
    }
    return rval;
  }

  public static trimToEmpty(input: string): string {
    // AG:12.16.2020 - Swapping out the OR for a null coalesce operator
    // Neon was throwing an error: t.trim is not a function so it is possible
    // that if the input was null it was trying to trim it. This will no
    // longer happen.
    // WAS: const t: string = input || '';
    const t: string = input ?? '';
    return t.trim();
  }

  public static trimToNull(input: string): string {
    const x: string = StringRatchet.trimToEmpty(input);
    return x.length > 0 ? x : null;
  }

  public static stripNonNumeric(input: string): string {
    let rval: string = input;
    if (input != null && !StringRatchet.stringContainsOnlyNumbers(input)) {
      // Im sure there is a better way
      rval = '';
      for (let i = 0; i < input.length; i++) {
        const c: string = input.charAt(i);
        if (StringRatchet.stringContainsOnlyNumbers(c) || (i === 0 && c === '-')) {
          rval += c;
        }
      }
    }

    return rval;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public static csvSafe(input: any): string {
    let rval: string = StringRatchet.trimToEmpty(StringRatchet.safeString(input));
    rval.split('"').join('\\"');
    if (rval.indexOf(',') !== -1 || rval.indexOf('"') !== -1 || rval.indexOf("'") !== -1) {
      rval = '"' + rval + '"';
    }
    return rval;
  }
}
