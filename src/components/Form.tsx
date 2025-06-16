import React from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form';
import { SignUpSchema, type SignUpSchemaType } from '../lib/zodSchema';
import { zodResolver } from '@hookform/resolvers/zod';

const Form = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
      } = useForm<SignUpSchemaType>({ resolver: zodResolver(SignUpSchema) });
    
      const onSubmit: SubmitHandler<SignUpSchemaType> = (data) => console.log(data)
    
      return (
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <input className="input" placeholder="email" {...register("email")} />
          {errors.email && <span>{errors.email.message}</span>}
    
          <input
            className="input"
            placeholder="password"
            {...register("password")}
          />
    
          {errors.password && <span>{errors.password.message}</span>}
    
          <button type="submit">submit!</button>
        </form>
      );
}

export default Form