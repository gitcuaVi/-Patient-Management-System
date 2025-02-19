"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import  CustomFormField  from "@/components/CustomFormField"
import SubmitButton from "@/components/SubmitButton"
import { useState } from "react"
import { PatientFormValidation, UserFormValidation } from "@/lib/validation"
import { create } from "domain"
import { useRouter } from "next/navigation"
import { createUser, registerPatient } from "@/lib/actions/patient.action"
import { FormFieldType } from "./PatientForm"

import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { Label } from "../ui/label"
import Image from "next/image";
import { SelectItem } from "../ui/select"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import  FileUploader  from "../FileUploader"
import { blob } from "stream/consumers"





export const RegisterForm = ({user}:{user:User})=> {
  // 1. Define your form.
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true)
    
    let formData;

    if(values.identificationDocument && values.identificationDocument.length > 0) {
      const blobFile = new Blob([values.identificationDocument[0]],{
        type: values.identificationDocument[0].type,
      })
      formData = new FormData();
      formData.append('BlobFile',blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }
    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      }
      const patient = await registerPatient(patientData);
      if(patient) router.push(`/patients/${user.$id}/new-appointment`)
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
        iconSrc="/assets/icons/user.svg"
        iconAlt="User"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="email"
        label="Email address"
        placeholder="trangiavi@gmail.com"
        iconSrc="/assets/icons/email.svg"
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
                  <RadioGroup
                    className="flex h-6 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option, i) => (
                      <div key={option + i} className="radio-group">
                        <RadioGroupItem value={option} id={option}
                         className="w-4 h-4 rounded-full border border-gray-400 data-[state=checked]:bg-blue-500"
                        />
                        <Label htmlFor={option} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
        </div>
        
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
          <h2 className="sub-header">Medical infomation.</h2>
          </div>
        </section>


        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
        fieldType={FormFieldType.SELECT}
        control={form.control}
        name="primaryPhysician"
        label="Primary physician"
        placeholder="Select your primary physician"
        
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className="flex cursor-pointer items-center gap-2">
                <Image 
                src={doctor.image}
                height={32}
                width={32}
                alt={doctor.name}
                className="rounded-full border border-dark-500"
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="insuranceProvider"
        label="Insurance Provider"
        placeholder="BlueCross BlueShield"
        />
        <CustomFormField 
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="insurancePolicyNumber"
        label="Isurance Policy Number"
        placeholder="BHYT125547793"
        />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="allergies"
        label="Allergies (if any)"
        placeholder="Peanuts, penicillin, pollen"
        />
        <CustomFormField 
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="currentMedications"
        label="Current Medications (if any)"
        placeholder="Ibuprofen 200mg, Paracetamol 500mg"
        />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="familyMedicalHistory"
        label="Family Medical History"
        placeholder="Mother had brain canser, Father had heart disease"
        />
        <CustomFormField 
        fieldType={FormFieldType.TEXTAREA}
        control={form.control}
        name="passMedicalHistory"
        label="Pass Medical History"
        placeholder="Appendectomy, Tonsillectomy"
        />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
          <h2 className="sub-header">Identification and Verification.</h2>
          </div>
        </section>

        <CustomFormField 
        fieldType={FormFieldType.SELECT}
        control={form.control}
        name="identificationType"
        label="Identification Type"
        placeholder="Select an Identification Type"
        
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField 
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="identificationNumber"
        label="Identification Number"
        placeholder="123456789"
        />

      <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="identificationDocument"
              label="Scanned copy of Identification Document"
              renderSkeleton={(field) => (
                <FormControl>
                 <FileUploader files={field.value} onChange={field.onChange}
                 />
                </FormControl>
              )}
            />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
          <h2 className="sub-header">Consent and privacy.</h2>
          </div>
        </section>
        <CustomFormField 
        fieldType={FormFieldType.CHECKBOX}
        control={form.control}
        name = "treatmentConsent"
        label="I consent to treatment"
        />
        <CustomFormField 
        fieldType={FormFieldType.CHECKBOX}
        control={form.control}
        name = "disclosureConsent"
        label="I consent to disclosure of information"
        />
        <CustomFormField 
        fieldType={FormFieldType.CHECKBOX}
        control={form.control}
        name = "privacyConsent"
        label="I consent to privacy policy"
        />

      <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
    </form>
  </Form>
  )
}

export default RegisterForm

  