export const isDefined = (x: any) => x !== null && typeof x !== 'undefined';

export const isUndefined = (x: any) => !isDefined(x);

export const isNumber = (x: any) => isDefined(x) && typeof x === 'number';

export const isString = (x: any) => isDefined(x) && typeof x === 'string';

export const isArray = (x: any) => isDefined(x) && Array.isArray(x);

export const isObject = (x: any) =>
  isDefined(x) && typeof x === 'object' && !isArray(x);
