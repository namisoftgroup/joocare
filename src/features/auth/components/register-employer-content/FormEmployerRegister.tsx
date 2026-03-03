"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { InputField } from "@/shared/components/InputField";
import { Button } from "@/shared/components/ui/button";
import {
  loginEmployerSchema,
  TLoginEmployerSchema,
} from "../../validation/employer-login-schema";
import { SelectInputField } from "@/shared/components/SelectInputField";
import React from "react";
type Option = {
  label: string;
  value: string;
};

const FormEmployerRegister = () => {
  //   const {
  //     register,
  //     handleSubmit,
  //     formState: { errors },
  //   } = useForm<TLoginEmployerSchema>({
  //     resolver: zodResolver(loginEmployerSchema),
  //   });
  //   const onSubmit: SubmitHandler<TLoginEmployerSchema> = (data) =>
  //     console.log(data);
  const [selectedOption, setSelectedOption] = React.useState<
    Option | undefined
  >(undefined);
  const [selectedPhoneCode, setSelectedPhoneCode] = React.useState<
    Option | undefined
  >(undefined);

  return (
    <form
      //   onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mt-6"
    >
      <InputField
        id="companyName"
        label="Company Name"
        type={"text"}
        placeholder="ex: JooCore"
        //   {...register("companyName")}
        //   error={errors.companyName?.message}
      />
      <InputField
        id="officialEmail"
        type="email"
        label="Official Email"
        placeholder="ex: mail@mail.com"
        // {...register("officialEmail")}
        // error={errors.officialEmail?.message}
      />
      <SelectInputField
        id="domain"
        label="Domain"
        placeholder="ex: Hospital"
        value={selectedOption}
        onChange={setSelectedOption}
        options={[
          { label: "Hospital", value: "hospital" },
          { label: "Software", value: "software" },
          { label: "Company", value: "company" },
        ]}
      />
        <label htmlFor={"phoneCode"} className="-mb-4 font-semibold">
          Contact person _ Phone number
        </label>
      <div className="flex items-center gap-2">
        <SelectInputField
          id="phoneCode"
          label=""
          placeholder="+999"
          value={selectedPhoneCode}
          onChange={setSelectedPhoneCode}
          className="w-[150px]"
          options={[
            { label: "+999", value: "+999", image: "/assets/flag.svg" },
            { label: "+24", value: "+24", image: "/assets/flag.svg" },
            { label: "+55", value: "+55", image: "/assets/flag.svg" },
          ]}
        />
        <InputField
          id="personFullName"
          type="text"
          label=""
          placeholder="ex: John Doe"
          // {...register("Contact person _ full name ")}
          // error={errors.Contact person _ full name ?.message}
        />
      </div>
      <InputField
        id="personFullName"
        type="text"
        label="Contact person _ full name "
        placeholder="ex: John Doe"
        // {...register("Contact person _ full name ")}
        // error={errors.Contact person _ full name ?.message}
      />
      <InputField
        id="createPassword"
        type="password"
        label="Create password"
        placeholder="******"
        // {...register("createPassword")}
        // error={errors.createPassword?.message}
      />
      <div className="flex justify-center">
        <Button
          hoverStyle={"slideSecondary"}
          className="w-1/3"
          size={"pill"}
          type="submit"
        >
          Register
        </Button>
      </div>
    </form>
  );
};

export default FormEmployerRegister;
