import { FormProvider, useForm,type SubmitHandler } from 'react-hook-form'
import SelectField from './SelectField'
import TextArea from './TextArea'
import DragNdrop from './DragNdrop'
import { formSchema, type FormSchemaType } from '../lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import Signup from './Signup'

const SplittedForm = () => {
    const methods = useForm<FormSchemaType>({ 
        resolver: zodResolver(formSchema),
        defaultValues:{
            message:''
        }})
    const SubmitHandlerFn:SubmitHandler<FormSchemaType> = (data)=> console.log(data)
  return (
    <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(SubmitHandlerFn)}>
        <Signup/>
        <SelectField/>
        <TextArea/>
        <DragNdrop/>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
        </form>
    </FormProvider>
  )
}

export default SplittedForm