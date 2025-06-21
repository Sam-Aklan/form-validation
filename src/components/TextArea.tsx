import React from 'react'
import { useFormContext } from 'react-hook-form'
import type { TextAreaType } from '../lib/zodSchema'

const TextArea = () => {
    const{
        register,
        watch,
        setValue,
    formState:{errors}}=useFormContext<TextAreaType>()
    const descriptionValue = watch('description')
    const maxLength = 200
    const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>)=>{
      if(e.target.value.length<=200) setValue('description',e.target.value,{shouldValidate:true})
      
      
    }
  return (
    <>
    <label className="block font-medium">
        Description:
        <textarea
          {...register('description')}
          value={descriptionValue}
          onChange={handleOnChange}
          className={`w-full border rounded p-2 mt-1 ${descriptionValue.length > 200?'border-red-500 focus:border-red-500 ':'border-black'}`}
          rows={5}
        />
      </label>
      <div className="text-sm text-gray-600">
        {descriptionValue.length} / {maxLength} characters
      </div>
      {errors.description&& (
        <p className="text-red-500 text-sm">{errors.description.message}</p>
      )}
    </>
  )
}

export default TextArea