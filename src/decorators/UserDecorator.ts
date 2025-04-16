import { registerDecorator, ValidationOptions } from 'class-validator';
import { AppDataSource } from '../database';
import { User } from '../models/User';

export function UserExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'userExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any): Promise<boolean>  {
          try {
            if (!AppDataSource.isInitialized) {
              await AppDataSource.initialize();
            }
            const user = await AppDataSource.getRepository(User).findOne({
              where: { id: value },
              cache: true
            });
            return !!user;
          } catch (error) {
            console.error('User validation error:', error);
            return false;
          }
        },
        defaultMessage(): string {
          return 'User with this ID does not exist';
        }
      }
    });
  };
}