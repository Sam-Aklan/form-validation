import { z } from 'zod';

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(3)
    .max(20)
});

type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export {SignUpSchema, type SignUpSchemaType}