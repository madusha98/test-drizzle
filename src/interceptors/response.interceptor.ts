import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { getTracer } from 'src/config/instrumentation.config';

export interface FormattedResponse<T> {
  statusCode: number;
  message: string[];
  data: T;
  traceId?: string;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, FormattedResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<FormattedResponse<T>> {
    const tracer = getTracer();
    const span = tracer.startSpan('ResponseInterceptor');
    console.log(span?.spanContext()?.traceId);
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: ['success'],
        data,
        traceId: span?.spanContext()?.traceId ?? '-',
      })),
    );
  }
}
