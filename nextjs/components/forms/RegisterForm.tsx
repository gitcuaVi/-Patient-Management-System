"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { set, z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import  CustomFormField  from "@/components/CustomFormField"
import SubmitButton from "@/components/SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { create } from "domain"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.action"
import { FormFieldType } from "./PatientForm"
import * as RadioGroup from "@radix-ui/react-radio-group"
import { GenderOptions } from "@/constants"



export const RegisterForm = ({user}:{user:User})=> {
  // 1. Define your form.
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit({name, email, phone}: z.infer<typeof UserFormValidation>) {
    setIsLoading(true)
    
    try {
      const userData = {
        name,
        email,
        phone,
      }

      const user = await createUser(userData);


      if(user) router.push(`/patients/${user.$id}/register`)
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
            <h1 className="Header">Wellcome 👋</h1>
            <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
          <h2 className="sub-header">Persional infomation.</h2>
          </div>
        </section>

        <CustomFormField 
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="name"
        label="Full name"
        placeholder="trangiavi"
        iconSrc="assets/icons/user.svg"
        iconAlt="User"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="email"
        label="Email address"
        placeholder="trangiavi@gmail.com"
        iconSrc="assets/icons/email.svg"
        iconAlt="email"
        />
        <CustomFormField 
        fieldType={FormFieldType.PHONE_INPUT}
        control={form.control}
        name="phone"
        label="Phone number"
        placeholder="1234567890"
        />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
        fieldType={FormFieldType.DATE_PICKER}
        control={form.control}
        name="birthDate"
        label="Date of birth"

        />
        <CustomFormField 
        fieldType={FormFieldType.SKELETON}
        control={form.control}
        name="gender"
        label="Gender"
        renderSkeleton={(field) => (
          <FormControl>
          <RadioGroup.Root className="flex h-11 gap-6 xl:justify-between" 
          onValueChange={field.onChange} 
          defaultValue={field.value}>
          <div>
            {GenderOptions.map((option) => (
              <div key={option} className="radio-group">
                <RadioGroup.RadioGroupItem value={option} id={option} />
                <label htmlFor={option} className="cursor-point">{option}</label>
              </div>
            ))}
          </div>
        </RadioGroup.Root>

          </FormControl>
        )}
        />
        </div>
        
        <div className="flex flex-col gap-6 xl:flex-row">
        
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
        
        </div>
      <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
    </form>
  </Form>
  )
}

export default RegisterForm