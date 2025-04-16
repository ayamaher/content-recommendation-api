import { IsUUID, IsIn, IsOptional, IsInt, Min, Max, ValidateIf } from 'class-validator';
import { UserExists } from '../decorators/UserDecorator';
import { ContentExists } from '../decorators/ContentDecorator';

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
