/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ResponseHandler {
  public sendSuccess<T>(data?: T) {
    return { success: true, data };
  }

  public sendError(message: string, status = HttpStatus.BAD_REQUEST) {
    throw new HttpException(
      {
        success: false,
        message,
      },
      status,
    );
  }

  public async sendResponse<T>(promise: Promise<T>) {
    try {
      const data = await promise;
      return this.sendSuccess(data);
    } catch (err: unknown) {
      if (err instanceof HttpException) {
        const response = err.getResponse();

        const message =
          typeof response === 'object' && 'message' in response
            ? (response as any).message
            : err.message;

        return this.sendError(message as string, err.getStatus());
      }

      return this.sendError(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
