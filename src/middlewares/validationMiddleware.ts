import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';

export function validateDto<T extends object>(dtoClass: new () => T): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(dtoClass, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const message = errors.map((error: ValidationError) => 
        Object.values(error.constraints || {})
      ).join(', ');
      res.status(400).json({
        statusCode: 400,
        message: `Validation failed: ${message}`,
        errors: errors.map(error => ({
          property: error.property,
          constraints: error.constraints
        }))
      });
      return;
    }

    req.body = dto;
    next();
  };
}
