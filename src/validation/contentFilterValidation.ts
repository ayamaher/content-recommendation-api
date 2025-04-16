import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export class FilterContentDto {
  @IsOptional()
  @IsIn(['article', 'video', 'image', 'podcast'])
    type: string;

  @IsOptional()
    category: string;

  @IsOptional()
  @IsInt()
  @Min(1)
    page?: number = 1;
 
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
    limit?: number = 10;
}
