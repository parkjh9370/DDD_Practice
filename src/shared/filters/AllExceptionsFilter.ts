import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

interface IErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  error: {
    message: string;
    stack: string[];
  };
  result: object;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  protected response: IErrorResponse;

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  protected buildErrorResponse(exception: unknown, context: HttpArgumentsHost): IErrorResponse {
    const { httpAdapter } = this.httpAdapterHost;

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const stack = exception instanceof Error ? exception.stack : (exception as string);
    const message = exception instanceof Error ? exception.message : exception;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(context.getRequest()),
      ok: false,
      error: {
        message: message as string,
        stack: stack
          ? stack
              .toString()
              .split('\n')
              .map((line: string) => line.trim())
          : [],
      },
      result: {},
    };

    return responseBody;
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    this.response = this.buildErrorResponse(exception, ctx);
    this.logger.error(this.response);

    httpAdapter.reply(ctx.getResponse(), this.response, this.response.statusCode);
  }
}
