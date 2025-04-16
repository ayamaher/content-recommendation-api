import { Request, Response, NextFunction, RequestHandler } from 'express';

declare global {
  namespace Express {
    interface Request {
      validatedQuery?: any;
    }
  }
}
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';

export function validateDto<T extends object>(
  dtoClass: new () => T,
  validationType: 'body' | 'query' = 'body'
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const data = validationType === 'body' ? req.body : req.query;
    const dto = plainToInstance(dtoClass, data, {
      enableImplicitConversion: true 
    });
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const message = errors.map((error: ValidationError) => 
        Object.values(error.constraints || {})
      ).join(', ');
      res.status(400).json({
        statusCode: 400,
        message: `Validation failed: ${message}`,
        errors: errors.map(error => ({
          property: error.property,
          constraints: error.constraints,
          value: error.value
        }))
      });
      return;
    }

    if (validationType === 'body') {
      req.body = dto;
    } else {
      // Create a new validatedQuery object instead of modifying req.query directly
      req.validatedQuery = dto;
    }
    next();
  };
}
