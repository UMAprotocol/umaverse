import * as Sentry from "@sentry/nextjs";
import { ContentfulSynth } from "./contentful";

export function errorFilter(value: unknown | Error): boolean {
  if (value instanceof Error) {
    Sentry.captureException(value);
    return false;
  }
  return true;
}

export class SynthFetchingError extends Error {
  public constructor(message: string, synth: ContentfulSynth) {
    super();
    this.name = this.constructor.name;
    this.message = `Failed to fetch synth ${synth.shortDescription} with address: ${synth.address}. Got error ${message}`;
  }
}
