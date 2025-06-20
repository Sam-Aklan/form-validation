import { useFormContext } from "react-hook-form"
import type { SignupType } from "../lib/zodSchema"

const Signup = () => {
    const {register,formState:{errors}} = useFormContext<SignupType>()
  return (
    <div className="flex flex-col gap-1">
         <input className="border border-black" placeholder="email" {...register("email")} />
          {errors.email && <span className="text-red-500">{errors.email.message}</span>}
    
          <input
            className="border border-black"
            placeholder="password"
            {...register("password")}
          />
           {errors.password && <span className="text-red-500">{errors.password.message}</span>}
    </div>
  )
}

export default Signup