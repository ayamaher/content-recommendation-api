import { IsUUID, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { UserExists } from '../decorators/UserDecorator';

export class GetRecommendationsDto {
  @IsUUID()
  @UserExists()
    userId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
    page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  @Type(() => Number)
    limit?: number = 10;
}