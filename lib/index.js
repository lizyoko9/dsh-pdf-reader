import { installPdfReader } from "./reader.js";

export const name = "dsh-pdf-reader";
export const inject = [];

export function apply(ctx) {
  installPdfReader(ctx);
}
