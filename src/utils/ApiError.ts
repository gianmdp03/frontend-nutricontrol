export type ApiErrorDetails = Record<string, string> | string | null | unknown;

export class ApiError extends Error {
  public statusCode: number;
  public details?: ApiErrorDetails;

  constructor(statusCode: number, message: string, details?: ApiErrorDetails) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export async function handleResponseError(response: Response): Promise<never> {
  const statusCode = response.status;
  let message = `Error de servidor (${statusCode})`;
  let details: ApiErrorDetails = null;

  try {
    const errorJson = await response.json();
    message = errorJson.message || errorJson.error || message;
    details = errorJson.details || errorJson.errors || errorJson;
  } catch {
    try {
      const textMsg = await response.text();
      if (textMsg) {
        message = textMsg;
      }
    } catch {
      // Ignorar error al leer cuerpo
    }
  }

  throw new ApiError(statusCode, message, details);
}