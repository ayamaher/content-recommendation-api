import Joi from 'joi';
import { IsUUID, IsIn, IsOptional, IsInt, Min, Max, ValidateIf } from 'class-validator';
import { AppDataSource } from '../database';
import { User } from '../models/User';
import { Content } from '../models/Content';
import { Validate } from 'class-validator';
// export const interactionSchema = Joi.object({
//   userId: Joi.string().required(),
//   contentId: Joi.string().required(),
//   type: Joi.string().valid('view', 'like', 'bookmark', 'rate').required(),
//   rating: Joi.number().min(1).max(5).optional(),
// });


async function validateUserExists(userId: string) {
  const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
  return !!user;
}

async function validateContentExists(contentId: string) {
  const content = await AppDataSource.getRepository(Content).findOneBy({ id: contentId });
  return !!content;
}

export class CreateInteractionDto {
  @IsUUID()
  @Validate(async (value: string) => await validateUserExists(value), {
    message: 'User with this ID does not exist'
  })
    userId: string;

  @IsUUID()
  @Validate(async (value: string) => await validateContentExists(value), {
    message: 'Content with this ID does not exist'
  })
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
