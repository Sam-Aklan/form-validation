import React from 'react'
import { useFormContext } from 'react-hook-form'
import type { TextAreaType } from '../lib/zodSchema'

const TextArea = () => {
    const{
        register,
        watch,
        setValue,
    formState:{errors}}=useFormContext<TextAreaType>()
    const messageValue = watch('message')
    const maxLength = 200
    const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>)=>{
      console.log('message length',messageValue.length)
      if(e.target.value.length<=200) setValue('message',e.target.value,{shouldValidate:true})
      
      
    }
  return (
    <>
    <label className="block font-medium">
        Message:
        <textarea
          {...register('message')}
          value={messageValue}
          onChange={handleOnChange}
          className={`w-full border rounded p-2 mt-1 ${messageValue.length > 200?'border-red-500 focus:border-red-500 ':'border-black'}`}
          rows={5}
        />
      </label>
      <div className="text-sm text-gray-600">
        {messageValue.length} / {maxLength} characters
      </div>
      {errors.message&& (
        <p className="text-red-500 text-sm">{errors.message.message}</p>
      )}
    </>
  )
}

export default TextArea