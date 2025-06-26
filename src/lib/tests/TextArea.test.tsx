import { FormProvider, useForm } from "react-hook-form";
import { TextAreaSchema, type TextAreaType } from "../zodSchema";
import TextArea from "../../components/TextArea";
import { zodResolver } from "@hookform/resolvers/zod";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

const FormWraper = ({
    submitHandler,
  }: {
    submitHandler: (data: TextAreaType) => void;
  }) => {
    const methods = useForm<TextAreaType>({
      resolver: zodResolver(TextAreaSchema),
      defaultValues: {
        description:'',
      },
    });
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submitHandler)}>
          <TextArea/>
          <button type="submit">submit</button>
        </form>
      </FormProvider>
    );
  };

  describe('textarea unit testing',()=>{
    let submitFn: ReturnType<typeof vi.fn>
    beforeEach(()=>{
        submitFn = vi.fn()
    })
    it('accept a vaild description',async()=>{
        render(<FormWraper submitHandler={submitFn} />)
        const textArea = screen.getByRole('textbox',) as HTMLTextAreaElement
        const submitBtn = screen.getByRole('button',{name:/submit/i})
        await userEvent.type(textArea, 'Hello World')
        await userEvent.click(submitBtn)
        await waitFor(()=>{
            console.log('payload',submitFn.mock.calls)
            expect(submitFn.mock.calls[0][0]).toEqual({
                description:"Hello World"
            })
        })
    }),
    it('test the characters count functionlity',async()=>{
        render(<FormWraper submitHandler={submitFn} />)
        const textArea = screen.getByRole('textbox',) as HTMLTextAreaElement
        await userEvent.type(textArea, 'Hello World')
        expect(screen.getByText('11 / 200 characters')).toBeInTheDocument()
    }),
    it('prevent input that exceeds 200 character',async()=>{
        render(<FormWraper submitHandler={submitFn} />)
        const textArea = screen.getByRole('textbox',) as HTMLTextAreaElement
        await userEvent.type(textArea, 'a'.repeat(205))
        expect(screen.getByText('200 / 200 characters'))
    }),
    it('show description is required',async()=>{
        render(<FormWraper submitHandler={submitFn} />)
        const submitBtn = screen.getByRole('button',{name:/submit/i})
        await userEvent.click(submitBtn)
       expect(screen.getByText('Description is required')).toBeInTheDocument()
       expect(submitFn).not.toBeCalled
    })
  })