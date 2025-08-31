import { z } from 'zod';

export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const data = req[source];
      const validated = schema.parse(data);
      req[source] = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
        
        return errorResponse(res, 'Validation failed', errors, 422);
      }
      next(error);
    }
  };
};

// Common validation schemas
export const schemas = {
  // Auth schemas
  register: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().min(6)
  }),
  
  login: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  }),
  
  // Donation schemas
  createDonation: z.object({
    amount: z.number().min(10000),
    donorName: z.string().optional(),
    donorEmail: z.string().email().optional(),
    donorPhone: z.string().optional(),
    isAnonymous: z.boolean().default(false),
    message: z.string().optional(),
    bukti_transfer_url: z.string().url()
  })
};