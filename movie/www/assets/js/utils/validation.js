// Basic input validation helpers
export const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;
export const isId = (v) => /^\w[\w-]*$/.test(String(v));
export const isPositiveInt = (n) => Number.isInteger(n) && n > 0;

export const validateSeatIds = (seats) => Array.isArray(seats) && seats.every((s) => /^([A-Z])(\d{1,2})$/.test(String(s)));

export const assert = (cond, msg) => { if (!cond) throw new Error(msg || 'Validation failed'); };