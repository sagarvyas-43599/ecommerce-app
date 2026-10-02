import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export class ApiResponse<T = any> {
  public success: boolean;
  public message: string;
  public data?: T;
  public meta?: PaginationMeta;

  constructor(statusCode: number, data?: T, message = 'Success', meta?: PaginationMeta) {
    this.success = statusCode < 400;
    this.message = message;
    if (data !== undefined) this.data = data;
    if (meta !== undefined) this.meta = meta;
  }

  static send<T>(res: Response, statusCode: number, data?: T, message = 'Success', meta?: PaginationMeta) {
    return res.status(statusCode).json(new ApiResponse<T>(statusCode, data, message, meta));
  }
}
