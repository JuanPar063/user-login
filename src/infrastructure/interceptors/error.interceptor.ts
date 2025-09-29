import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          return throwError(() => error);
        }

        // Log the error for debugging
        console.error('Unhandled error:', error);

        // Handle database errors
        if (error.code === '23505') {
          // PostgreSQL unique violation
          return throwError(
            () =>
              new HttpException(
                'Duplicate entry found',
                HttpStatus.CONFLICT,
              ),
          );
        }

        if (error.code === '23503') {
          // PostgreSQL foreign key violation
          return throwError(
            () =>
              new HttpException(
                'Referenced entity not found',
                HttpStatus.BAD_REQUEST,
              ),
          );
        }

        // Generic error response
        return throwError(
          () =>
            new HttpException(
              'Internal server error',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        );
      }),
    );
  }
}