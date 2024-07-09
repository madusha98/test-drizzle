import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { getTracer } from 'src/config/instrumentation.config';

export interface FormattedException {
  statusCode: number;
  message: string[];
  traceId?: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const e: any = exception.getResponse();

    let message: string[] = [];

    const tracer = getTracer();
    const span = tracer.startSpan('HttpExceptionFilter');
    span.setAttribute('exception.status', status);

    if (typeof e === 'string') {
      message = [e];
    } else {
      message = e.message;
    }

    span.setAttribute('exception.message', message);

    const error: FormattedException = {
      statusCode: status,
      message,
      traceId: span?.spanContext()?.traceId ?? '-',
    };

    response.status(status).json(error);
  }
}
