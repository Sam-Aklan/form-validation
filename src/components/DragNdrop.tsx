import { useCallback, useMemo } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import type { FileType } from '../lib/zodSchema';

const DragNdrop = () => {
 const{
        watch,
        setValue,
    formState:{errors}}=useFormContext<FileType>()
   const file = watch('file')
        const onDrop = useCallback(
          (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            if (acceptedFiles.length > 0) {
              setValue('file', acceptedFiles[0], { shouldValidate: true });
            } else if (fileRejections.length > 0) {
              // Still assign the rejected file to trigger Zod validation
              setValue('file', fileRejections[0].file, { shouldValidate: true });
            }
          },
          []
        );
        const isTest = useMemo(()=>import.meta.env.MODE ==='test',[]) // will be needed when running unit testing
        const{getRootProps,isDragActive,getInputProps,acceptedFiles} = useDropzone({
                onDrop,
                multiple:false,
                maxSize: 1 * 1024 * 1024,
                accept:isTest?undefined: {
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

  return (
    <>
    
    <div
            {...getRootProps()}
            className={`border-2 p-6 text-center cursor-pointer rounded h-[30vh] relative ${
              isDragActive ? 'border-blue-500' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()}
            data-testid="file-input" 
            className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
            
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
        <p
        data-testid='err-par' 
        className="text-red-500 text-sm">{errors.file.message}</p>
      )}

    </>
  )
}

export default DragNdrop