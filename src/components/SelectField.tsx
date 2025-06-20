import { useFormContext } from "react-hook-form";
import type { SelectionsType } from "../lib/zodSchema";

const options = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
  { label: 'None of the above', value: 'none' },
];

const SelectField = () => {
  const {register,watch}= useFormContext<SelectionsType>()
  const selections = watch('selections')
  return (
    
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
  )
}

export default SelectField