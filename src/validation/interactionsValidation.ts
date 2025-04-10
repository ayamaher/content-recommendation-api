import { IsUUID, IsIn, IsOptional, IsInt, Min, Max, ValidateIf, Validate, ValidationArguments } from 'class-validator';
import { ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';
import { AppDataSource } from '../database';
import { User } from '../models/User';
import { Content } from '../models/Content';
import type { ValidationOptions } from 'class-validator';

export function UserExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'userExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any) {
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
        defaultMessage() {
          return 'User with this ID does not exist';
        }
      }
    });
  };
}

export function ContentExists(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'contentExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: any) {
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
        defaultMessage() {
          return 'Content with this ID does not exist';
        }
      }
    });
  };
}

export class CreateInteractionDto {
  @IsUUID()
  @UserExists()
    userId: string;

  @IsUUID()
  @ContentExists()
    contentId: string;

  @IsIn(['view', 'like', 'bookmark', 'rate'])
    type: string;

  @ValidateIf(o => o.type === 'rate')
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
    rating?: number;
}
