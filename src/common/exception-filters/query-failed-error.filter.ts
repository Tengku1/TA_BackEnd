import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

enum PostgresErrorCode {
    UniqueViolation = '23505',
    CheckViolation = '23514',
    NotNullViolation = '23502',
    ForeignKeyViolation = '23503'
}

@Catch(QueryFailedError)
export class QueryFailedErrorFilter implements ExceptionFilter {
    catch(exception: any | QueryFailedError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        //const request = ctx.getRequest<Request>();
        let message = exception.message;
        let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        let code = exception?.code || "0";

        switch (exception?.code) {
            case PostgresErrorCode.UniqueViolation:
            case PostgresErrorCode.ForeignKeyViolation:
                httpStatus = HttpStatus.CONFLICT;
                break;
            case PostgresErrorCode.NotNullViolation:
                httpStatus = HttpStatus.BAD_REQUEST;
                break;
            default:
                break;
        }

        response
            .status(httpStatus)
            .json({
                message: message,
                //errors: exception,
                status: httpStatus,
                code: code
            });
    }
}