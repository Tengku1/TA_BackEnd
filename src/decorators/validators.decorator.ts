import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsArrayOfObjects(validationOptions?: ValidationOptions) {
    return (object: unknown, propertyName: string) => {
        registerDecorator({
            name: 'IsArrayOfObjects',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any): boolean {
                    if (value === undefined)
                        return true;
                    return (
                        value != null &&
                        Array.isArray(value) &&
                        value.every(
                            (element: any) =>
                                element instanceof Object && !(element instanceof Array),
                        )
                    );
                },
                defaultMessage: (validationArguments?: ValidationArguments): string =>
                    `${validationArguments.property} must be an array of objects`,
            },
        });
    };
}

export function IsOnlyDate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsOnlyDate',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: 'Please provide only date like 2020-12-08',
                ...validationOptions,
            },
            validator: {
                validate(value: any) {
                    const regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
                    return typeof value === 'string' && regex.test(value);
                },
            },
        });
    };
}