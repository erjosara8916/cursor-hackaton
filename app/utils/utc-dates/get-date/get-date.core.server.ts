import { UTCDate } from "@date-fns/utc";

/**
 * @default new Date()
 * @param date - The date to be converted to UTC. If no date is provided, the
 *   current date is used.
 */
export const getUTCDate = (date = new Date()) => new UTCDate(date);
