import { FormProvider, useForm } from "react-hook-form"
import { checkboxSchema, type SelectionsType } from "../zodSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import SelectField from "../../components/SelectField"
import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor, } from '@testing-library/react';
import {userEvent} from '@testing-library/user-event'


const FormWraper = ({onSubmit}:{onSubmit:(data:SelectionsType)=>void}) => {
    const methods = useForm<SelectionsType>({
        resolver:zodResolver(checkboxSchema),
        defaultValues:{
            selections:[]
        }
})
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
        <SelectField/>
        <button type="submit">
            submit
        </button>
        </form>
      </FormProvider>
    )
  }
  
  describe('selection field test',()=>{
    it('show error when no option is selected',async()=>{
      const submitFn= vi.fn()
      render(<FormWraper onSubmit={submitFn}/>)
      const submitBtn= screen.getByRole('button',{name:/submit/i})
      await userEvent.click(submitBtn)
      expect(screen.getByText('You must select at least one option.')).toBeInTheDocument()
      
    }),
    it('check if None of above is disabled',async()=>{
      const submitFn = vi.fn()
      render(<FormWraper onSubmit={submitFn}/>)
      const optionA =screen.getByRole('checkbox',{name:'Option A'})
      const None = screen.getByRole('checkbox',{name:'None of the above'})
      await userEvent.click(optionA)
      expect(None).toBeDisabled()
    }),

    it('check all option are disbled if none is selected',async()=>{
      const submitFn = vi.fn()
      render(<FormWraper onSubmit={submitFn}/>)
      const optionA =screen.getByRole('checkbox',{name:'Option A'})
      const optionB =screen.getByRole('checkbox',{name:'Option B'})
      const optionC =screen.getByRole('checkbox',{name:'Option C'})
      const None =screen.getByRole('checkbox',{name:'None of the above'})

      await userEvent.click(None)
      expect(optionA).toBeDisabled()
      expect(optionB).toBeDisabled()
      expect(optionC).toBeDisabled()

    }),
    it('if user submitted the right data',async()=>{
      const submitFn = vi.fn()
      render(<FormWraper onSubmit={submitFn}/>)
      const optionA =screen.getByRole('checkbox',{name:'Option A'})
      const optionB =screen.getByRole('checkbox',{name:'Option B'})
      const submitBtn= screen.getByRole('button',{name:/submit/i})
      await userEvent.click(optionA)
      await userEvent.click(optionB)
      await userEvent.click(submitBtn)
      await waitFor(() => {
        expect(submitFn).toHaveBeenCalled(); // optional
        expect(submitFn.mock.calls[0][0]).toEqual({ selections: ['a', 'b'] });
      });
      
      
    })
  })
  