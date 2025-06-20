import { useForm, type SubmitHandler } from 'react-hook-form';
import { formSchema, type FormSchemaType } from '../lib/zodSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDropzone, type DropEvent, type FileRejection } from 'react-dropzone';
import { useCallback, useEffect } from 'react';

const options = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
  { label: 'None of the above', value: 'none' },
];

const Form = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, },
        setValue,
        trigger,
        resetField
      } = useForm<FormSchemaType>({ resolver: zodResolver(formSchema),
        defaultValues:{
          message:'',
          file:undefined
        }
       });

      const selections = watch('selections')
      const messageValue = watch('message')
      const maxLength = 200
      // console.log("selection", selections, Array.isArray(selections))
      // console.log('selections error', errors.selections?.message)
      const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>)=>{
        setValue('message',e.target.value,{shouldValidate:true})
        
      }
      const file = watch('file')
      const onDrop = useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
          if (acceptedFiles.length > 0) {
            setValue('file', acceptedFiles[0], { shouldValidate: true });
          } else if (fileRejections.length > 0) {
            // Still assign the rejected file to trigger Zod validation
            setValue('file', fileRejections[0].file, { shouldValidate: true });
          }
        },
        []
      );
      const{getRootProps,isDragActive,fileRejections,getInputProps,acceptedFiles} = useDropzone({
        onDrop,
        multiple:false,
        maxSize: 1 * 1024 * 1024,
        accept: {
          'application/pdf': ['.pdf'],
          'application/vnd.ms-powerpoint': ['.ppt'],
          'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
        },
      })
      const handlePreview = () => {
        if (acceptedFiles[0] && acceptedFiles[0].type === 'application/pdf') {
          const fileURL = URL.createObjectURL(acceptedFiles[0]);
          const newWindow = window.open(fileURL, '_blank');
    
          // Revoke URL after preview is opened (safe delay)
          setTimeout(() => {
            URL.revokeObjectURL(fileURL);
          }, 1000);
    
          // Optional: handle popup blockers
          if (!newWindow) {
            alert('Popup blocked. Please allow popups for this website to preview the file.');
          }
        } else {
          alert('Only PDF files can be previewed.');
        }
      };
    
      const onSubmit: SubmitHandler<FormSchemaType> = (data) => console.log(data)
     useEffect(()=>console.log('useEffect  files',file),[file])
    
      return (
        <form onSubmit={handleSubmit(onSubmit)} className="form"
        >
          <input className="input" placeholder="email" {...register("email")} />
          {errors.email && <span>{errors.email.message}</span>}
    
          <input
            className="input"
            placeholder="password"
            {...register("password")}
          />
    
          {errors.password && <span>{errors.password.message}</span>}

          {/* checkbox area */}

          <fieldset style={{display:'flex',flexDirection:'column'}}>
        <legend className="font-bold mb-2">Select options:</legend>
        {options.map((opt) => (
          <label key={opt.value} className="block">
            <input
              type="checkbox"
              value={opt.value}
              {...register('selections')}
              
              disabled={
                Array.isArray(selections) && selections?.includes('none') && opt.value !== 'none'
                  ? true
                  : opt.value === 'none' &&  Array.isArray(selections) && selections?.length > 0 && !selections.includes('none')
              }
            />
            {' '}{opt.label}
          </label>
        ))}
      </fieldset>

      {errors.selections && (
        <p className="text-red-500">{errors.selections.message}</p>
      )}

      {/* textarea area */}

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

      {/* file drop zone */}

<div
            {...getRootProps()}
            className={`border-2 p-6 text-center cursor-pointer rounded h-[30vh] relative ${
              isDragActive ? 'border-blue-500' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
            
            />
            {file &&!errors.file? (
              <p className="text-green-600">Selected: {file.name}</p>
            ) : isDragActive?(<p>drop here</p>):(
              <p>Drag & drop a PDF or PPT file here, or click to select</p>
            )}
            {file && file.type === 'application/pdf' && (
        <button
          type="button"
          onClick={handlePreview}
          className="bg-gray-600 text-white p-4 w-1/6 rounded"
        >
          Preview PDF
        </button>
      )}

          </div>
        

      {errors.file && (
        <p className="text-red-500 text-sm">{errors.file.message}</p>
      )}

     
    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
        </form>
      );
}

export default Form

