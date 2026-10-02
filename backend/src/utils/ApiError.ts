export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: any[];

  constructor(statusCode: number, message: string, errors?: any[], isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(msg = 'Bad Request', errors?: any[]) {
    return new ApiError(400, msg, errors);
  }

  static unauthorized(msg = 'Unauthorized access') {
    return new ApiError(401, msg);
  }

  static forbidden(msg = 'Access forbidden') {
    return new ApiError(403, msg);
  }

  static notFound(msg = 'Resource not found') {
    return new ApiError(404, msg);
  }

  static conflict(msg = 'Resource conflict') {
    return new ApiError(409, msg);
  }

  static unprocessable(msg = 'Validation Error', errors?: any[]) {
    return new ApiError(422, msg, errors);
  }

  static internal(msg = 'Internal server error') {
    return new ApiError(500, msg);
  }
}
