import type { z } from "zod/mini";

type BaseServiceArgs<TResponseFields> = {
  responseSchema: z.ZodMiniType<TResponseFields>;
};

export type QueryServiceArgs<TSuccessResponse> = {
  getData: () => Promise<unknown>;
} & BaseServiceArgs<TSuccessResponse>;

export type MutationServiceArgs<TSuccessResponse, TInputs> = {
  getData: (validatedInputs: TInputs) => Promise<unknown>;
  inputs: unknown;
  inputsSchema: z.ZodMiniType<TInputs>;
} & BaseServiceArgs<TSuccessResponse>;
