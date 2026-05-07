import { DateTime } from 'luxon';

const NAIVE_LOCAL_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?$/;

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parses a transaction record instant from the API into a UTC Date.
 * Accepts ISO 8601 with offset / Z, or naive `yyyy-mm-ddTHH:mm:ss` interpreted in {@link defaultTimeZone},
 * or date-only `yyyy-mm-dd` as start-of-day in that zone.
 */
export function parseRecordInstantToUtc(
  raw: string,
  defaultTimeZone: string,
): Date {
  const trimmed: string = raw.trim();
  if (trimmed.length === 0) {
    throw new Error('record instant cannot be empty');
  }
  let dt: DateTime = DateTime.fromISO(trimmed, { setZone: true });
  if (dt.isValid) {
    return dt.toUTC().toJSDate();
  }
  if (NAIVE_LOCAL_ISO.test(trimmed)) {
    dt = DateTime.fromISO(trimmed, { zone: defaultTimeZone });
    if (dt.isValid) {
      return dt.toUTC().toJSDate();
    }
  }
  if (DATE_ONLY.test(trimmed)) {
    dt = DateTime.fromISO(`${trimmed}T00:00:00`, {
      zone: defaultTimeZone,
    });
    if (dt.isValid) {
      return dt.toUTC().toJSDate();
    }
  }
  throw new Error('Invalid record instant');
}
