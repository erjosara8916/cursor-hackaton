import { z } from "zod/mini";

export const createEmailSchema = (opts?: string | z.core.$ZodEmailParams) => {
  return z.email(opts);
};

const MIN_STRING_LENGTH = 1;

export const createNonEmptySchema = (
  opts?: string | z.core.$ZodCheckMinLengthParams,
) => {
  return z.minLength(MIN_STRING_LENGTH, opts);
};

export const createURLSchema = (opts?: string | z.core.$ZodURLParams) => {
  return z.url(opts);
};
