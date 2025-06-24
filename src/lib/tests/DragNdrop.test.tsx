import { FormProvider, useForm } from "react-hook-form";
import DragNdrop from "../../components/DragNdrop";
import { fileSchema, type FileType } from "../zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

const FormWraper = ({
  submitHandler,
}: {
  submitHandler: (data: FileType) => void;
}) => {
  const methods = useForm<FileType>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      file: undefined,
    },
  });
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submitHandler)}>
        <DragNdrop />
        <button type="submit">submit</button>
      </form>
    </FormProvider>
  );
};

const creatFile = (name: string, size: number, type: string) => {
  const file = new File(["a".repeat(size)], name, { type });
  Object.defineProperty(file, "size", { value: size });
  console.log("file info", file.size);
  return file;
};

describe("drag and drop unit testing", async () => {
  let submitFn: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    submitFn = vi.fn();
  });
  it("accept a valid Pdf file", async () => {
    render(<FormWraper submitHandler={submitFn} />);
    const file = creatFile("myPdf", 500 * 1024, "application/pdf");
    const fileInput = screen.getByTestId("file-input") as HTMLInputElement;
    await userEvent.upload(fileInput, file);
    // console.log('files loaded',fileInput.files)
    expect(screen.getByText(/Selected: myPdf/)).toBeInTheDocument();
    const submitBtn = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitBtn)
    await waitFor(() => {
      // because useForm submit function expect to object data and event and we want the data to check we exciplictly specifies submitFn.mock.calls[0][0]
      expect(submitFn.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          file: expect.objectContaining({
            name: 'myPdf',
            type: 'application/pdf',
          }),
        })
      );
    });
  });
  it('reject unsupported files',async()=>{
    render(<FormWraper submitHandler={submitFn}/>)
    const image = creatFile('myImg',100*1024,'image/png')
    const fileInput = screen.getByTestId("file-input") as HTMLInputElement;
    await userEvent.upload(fileInput,image,)
    expect(screen.getByText(/Only PDF or PPT files are allowed/)).toBeInTheDocument()
    expect(submitFn).not.toHaveBeenCalled()
  });
  it('reject files bigger than 1m',async()=>{
    render(<FormWraper submitHandler={submitFn}/>)
    const bigPdf = creatFile('bigPdf',2 * 1024 * 1024,'application/pdf')
    const fileInput = screen.getByTestId('file-input')
    await userEvent.upload(fileInput,bigPdf)
    expect(screen.getByText(/File size must be 1MB or less/)).toBeInTheDocument()
    expect(submitFn).not.toHaveBeenCalled()
  }),
  it('check preview btn is there for pdf',async()=>{
    render(<FormWraper submitHandler={submitFn} />);
    const file = creatFile("myPdf", 500 * 1024, "application/pdf");
    const fileInput = screen.getByTestId("file-input") as HTMLInputElement;
    await userEvent.upload(fileInput, file);
    expect(screen.getByText(/Selected: myPdf/)).toBeInTheDocument();
    const previewBtn = screen.getByRole('button',{name:'Preview PDF'})
    expect(previewBtn).toBeInTheDocument()
    const submitBtn = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitBtn)
    await waitFor(()=>{
        expect(submitFn.mock.calls[0][0]).toEqual(
          {file:expect.objectContaining({
            name:'myPdf',
            type:'application/pdf'
          })}
        )
    })
  });
  it('check preview btn dose not exist for ppt',async()=>{
    render(<FormWraper submitHandler={submitFn} />);
    const file = creatFile("myPPT", 500 * 1024, "application/vnd.ms-powerpoint");
    const fileInput = screen.getByTestId("file-input") as HTMLInputElement;
    await userEvent.upload(fileInput, file);
    expect(screen.getByText(/Selected: myPPT/)).toBeInTheDocument();
    
    expect(screen.queryByText(/Preview PDF/)).not.toBeInTheDocument()
    const submitBtn = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitBtn)
    await waitFor(()=>{
        expect(submitFn.mock.calls[0][0]).toEqual(
          {file:expect.objectContaining({
            name:'myPPT',
            type:'application/vnd.ms-powerpoint'
          })}
        )
    })
  })
});
