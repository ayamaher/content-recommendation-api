import { registerDecorator, ValidationOptions } from 'class-validator';
import { AppDataSource } from '../database';
import { Content } from '../models/Content';

export function ContentExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'contentExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any): Promise<boolean>  {
          try {
            if (!AppDataSource.isInitialized) {
              await AppDataSource.initialize();
            }
            const content = await AppDataSource.getRepository(Content).findOne({
              where: { id: value },
              cache: true
            });
            return !!content;
          } catch (error) {
            console.error('Content validation error:', error);
            return false;
          }
        },
        defaultMessage():string {
          return 'Content with this ID does not exist';
        }
      }
    });
  };
}