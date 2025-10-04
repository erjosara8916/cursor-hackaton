import { data as json } from "react-router";

import {
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  OK_STATUS_CODE,
} from "#/constants/http/status-codes/status-codes.constants.server";

const STATUS_CODES = {
  Error: "ERROR",
  Success: "SUCCESS",
} as const;

type SharedResponseOpts = {
  http?: {
    /**
     * The HTTP status code to return with the response.
     *
     * @default 500
     */
    statusCode: number;
  };
};

export function createErrorResponse<TErrorCode extends string>(
  errorCode: TErrorCode,
  message: string,
  opts?: SharedResponseOpts,
) {
  return json(
    {
      code: errorCode,
      message,
      status: STATUS_CODES.Error,
    },
    {
      status: opts?.http?.statusCode ?? INTERNAL_SERVER_ERROR_STATUS_CODE,
    },
  );
}

export function createSuccessResponse<
  TSuccessCode extends string,
  TData extends Record<string, unknown>,
>(successCode: TSuccessCode, data: TData, opts?: SharedResponseOpts) {
  return json(
    {
      ...data,
      code: successCode,
      status: STATUS_CODES.Success,
    },
    {
      status: opts?.http?.statusCode ?? OK_STATUS_CODE,
    },
  );
}
