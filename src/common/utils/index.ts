import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(NotFoundException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception.getStatus();
    // const message = exception.getMessage();

    console.log('%c⧭', 'color: #0088cc', context);

    response.status(status).json({
      //   message,
      statusCode: status,
      time: new Date().toISOString(),
    });
  }
}
