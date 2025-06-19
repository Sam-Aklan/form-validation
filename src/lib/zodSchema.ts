import { z } from 'zod';

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(3)
    .max(20)
});

const checkboxSchema = z
  .object({
    selections: z.union([
      z.array(z.string()),
      z.boolean(),
      z.undefined()
    ])
    .refine(
      (val) => Array.isArray(val) && val.length > 0, 
      {
        message: 'You must select at least one option.',
      }
    )
    .refine(
      (val) => Array.isArray(val) && !(val.includes('none') && val.length > 1),
      {
        message: 'If "None of the above" is selected, no other options can be selected.',
      }
    )

  });
  const TextAreaSchema = z.object({
    message: z
      .string()
      .nonempty({ message: 'Message is required' })
      .max(200, { message: 'Message must be at most 200 characters' }),
  });
const MAX_FILE_SIZE = 1 * 1024 * 1024
const fileTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
  const fileSchema = z.object({
    file: z
      .instanceof(File)
      .refine(
        (file) =>
          fileTypes.includes(file.type),
        { message: 'Only PDF or PPT files are allowed' }
      )
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: 'File size must be 1MB or less',
      }),
  });
 const formSchema = SignUpSchema.merge(checkboxSchema).merge(TextAreaSchema).merge(fileSchema)
type FormSchemaType = z.infer<typeof formSchema>;

export {formSchema, type FormSchemaType}