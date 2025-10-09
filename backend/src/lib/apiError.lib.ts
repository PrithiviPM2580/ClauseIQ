export class APIError extends Error {
  statusCode: number;
  status: 'fail' | 'error';
  errors: Array<{ field?: string; message: string }>;

  constructor(
    statusCode = 500,
    message = 'Something went wrong',
    errors: Array<{ filed?: string; message: string }> = []
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.statusCode = statusCode;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
