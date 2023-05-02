import {
    HttpException,
    HttpStatus,
    ValidationError,
    ValidationPipe,
    ValidationPipeOptions,
} from '@nestjs/common';


function buildMessages(validationErrors: ValidationError[]) {
    let errors = {};
    let messages = [];
    let _childErr = {};
    validationErrors.forEach(err => {
        if (err.constraints) {
            let values = Object.values(err.constraints);
            errors[err.property] = values;
            messages.push(values);
        } else if (err.children) {
            let _children = buildMessages(err.children);
            _childErr[err.property] = _children.errors;

            messages = messages.concat(_children.messages);
            errors = { ...errors, ..._childErr };
        }
    });

    return {
        errors, messages
    };
}

function translateErrors(validationErrors: ValidationError[]) {
    let { errors, messages } = buildMessages(validationErrors);
    return new HttpException({
        message: messages.join(),
        errors: errors,
        status: HttpStatus.BAD_REQUEST
    }, HttpStatus.BAD_REQUEST);
}

export const customValidationPipe = (options: ValidationPipeOptions) => new ValidationPipe({
    ...options,
    exceptionFactory: translateErrors,
});