// ---------------------------------------------------------------------------
// lib/errors.ts: custom errors. Messages are safe to show to users.
// ---------------------------------------------------------------------------

abstract class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError {}

export class CityNotFoundError extends AppError {
  constructor() {
    super("We could not find that city. Please check the spelling and try again.");
  }
}

export class AirQualityUnavailableError extends AppError {
  constructor() {
    super("Live air quality data is unavailable right now. Please try again shortly.");
  }
}

export class LlmResponseError extends AppError {
  constructor() {
    super("We could not generate advice right now. Please try again.");
  }
}