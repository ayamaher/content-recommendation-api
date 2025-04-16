import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsRatingValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isRatingValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const type = (args.object as any).type;
          if (type === 'rate') {
            return typeof value === 'number' && value >= 1 && value <= 5;
          }
          return value === undefined; // Ensure rating is undefined for other types
        },
        defaultMessage(args: ValidationArguments): string {
          const type = (args.object as any).type;
          return type === 'rate'
            ? 'Rating must be an integer between 1 and 5 when type is "rate".'
            : 'Rating must be undefined for types other than "rate".';
        },
      },
    });
  };
}