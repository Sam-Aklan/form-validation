import { FormProvider, useForm } from "react-hook-form";
import { SignUpSchema, type SignupType, } from "../zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Signup from "../../components/Signup";

const FormWraper = ({
    submitHandler,
  }: {
    submitHandler: (data: SignupType) => void;
  }) => {
    const methods = useForm<SignupType>({
      resolver: zodResolver(SignUpSchema),
    });
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submitHandler)}>
          <Signup/>
          <button type="submit">submit</button>
        </form>
      </FormProvider>
    );
  };

  describe('signup unit testing',()=>{
      let submitFn: ReturnType <typeof vi.fn>
    beforeEach(()=>{
        submitFn = vi.fn()
    }),
    it('submit empty fields',async()=>{
        render(<FormWraper submitHandler={submitFn}/>)
        const submitBtn = screen.getByRole('button',{name:/submit/i})
        await userEvent.click(submitBtn)
        expect(screen.getByText(/write an email/i)).toBeInTheDocument()
        expect(screen.getByText('password should be at least 3 characters')).toBeInTheDocument()
    }),
    it('invaild email vaild pass',async()=>{
        render(<FormWraper submitHandler={submitFn}/>)
        const emailInput = screen.getByPlaceholderText('email')
        const passInput = screen.getByPlaceholderText('password')
        await userEvent.type(emailInput,'invalidemail')
        await userEvent.type(passInput,'ghtpfs')
        const submitBtn = screen.getByRole('button',{name:/submit/i})
        await userEvent.click(submitBtn)
        expect(screen.getByText(/Invalid email/i)).toBeInTheDocument()
        expect(submitFn).not.toBeCalled()
    }),
    it('vaild email invalid pass',async()=>{
        render(<FormWraper submitHandler={submitFn}/>)
        const emailInput = screen.getByPlaceholderText('email')
        const passInput = screen.getByPlaceholderText('password')
        await userEvent.type(emailInput,'test@example.com')
        await userEvent.type(passInput,'ab'.repeat(12))
        const submitBtn = screen.getByRole('button',{name:/submit/i})
        await userEvent.click(submitBtn)
        expect(screen.getByText('should be at most 20')).toBeInTheDocument()
        expect(submitFn).not.toBeCalled()
    }),
    it('vaild email vaild password',async()=>{
        render(<FormWraper submitHandler={submitFn}/>)
        const emailInput = screen.getByPlaceholderText('email')
        const passInput = screen.getByPlaceholderText('password')
        await userEvent.type(emailInput,'test@example.com')
        await userEvent.type(passInput,'ab'.repeat(9))
        const submitBtn = screen.getByRole('button',{name:/submit/i})
        await userEvent.click(submitBtn)
        await waitFor(()=>{
            expect(submitFn.mock.calls[0][0]).toEqual({
                email:'test@example.com',
                password:'ab'.repeat(9)
            })
        })
    })
  })