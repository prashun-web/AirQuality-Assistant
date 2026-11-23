// ---------------------------------------------------------------------------
// lib/http.ts: JSON fetch with a timeout. Shared so the logic exists once.
// ---------------------------------------------------------------------------

export class UpstreamHttpError extends Error {
  constructor(readonly status: number) {
    super(`Upstream request failed with status ${status}`);
    this.name = "UpstreamHttpError";
  }
}

/** Fetches and parses JSON, aborting if the whole exchange exceeds timeoutMs. */
export async function fetchJsonWithTimeout<T>(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    if (!response.ok) throw new UpstreamHttpError(response.status);
    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}