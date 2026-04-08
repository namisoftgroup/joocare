"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { parsePhoneNumber } from "react-phone-number-input";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { InputField } from "@/shared/components/InputField";
import { SelectInputField } from "@/shared/components/SelectInputField";
import { Button } from "@/shared/components/ui/button";
import { PhoneInputCode } from "@/shared/components/PhoneInputCode";
import { FilepondUpload } from "@/shared/components/FilepondUpload";
import useGetCitiesByCountryId from "@/shared/hooks/useGetCitiesByCountryId";
import { updateCandidateBasicInfoAction } from "../../actions/basic-info-actions";
import type {
  CandidateSettingsOption,
  CandidateSettingsProfile,
} from "../../services/basic-info-service";
import ProfileImage from "./ProfileImage";
import {
  SettingBasicInfoSchema,
  type TSettingBasicInfoSchema,
} from "../../validation/basic-info-schema";

interface BasicInfoFormProps {
  profile: CandidateSettingsProfile;
  jobTitles: CandidateSettingsOption[];
  specialties: CandidateSettingsOption[];
  experiences: CandidateSettingsOption[];
  countries: CandidateSettingsOption[];
  initialCities: CandidateSettingsOption[];
}

const BasicInfoForm = ({
  profile,
  jobTitles,
  specialties,
  experiences,
  countries,
  initialCities,
}: BasicInfoFormProps) => {
  const locale = useLocale();
  const [isSaving, setIsSaving] = useState(false);
  const defaultValues = useMemo<TSettingBasicInfoSchema>(() => ({
    fullName: profile.name,
    email: profile.email,
    phoneNumber:
      profile.phoneCode && profile.phone
        ? `${profile.phoneCode}${profile.phone}`
        : profile.phone,
    jobTitle: profile.jobTitleId,
    specialty: profile.specialtyId,
    yearsOfExperience: profile.experienceId,
    country: profile.countryId,
    city: profile.cityId,
    dateOfBirth: profile.birthDate,
    profileImage: [],
    uploadCV: [],
  }), [profile]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TSettingBasicInfoSchema>({
    resolver: zodResolver(SettingBasicInfoSchema),
    mode: "onChange",
    defaultValues,
  });

  const selectedCountryId = useWatch({ control, name: "country" });
  const {
    cities,
    isLoading: isCitiesLoading,
  } = useGetCitiesByCountryId(Number(selectedCountryId));

  const cityOptions = useMemo(() => {
    if (cities.length > 0) {
      return cities
        .map((city) => ({
          label: String(city.name ?? ""),
          value: String(city.id ?? ""),
        }))
        .filter((city) => city.label);
    }

    return initialCities.map((city) => ({
      label: city.label,
      value: city.id,
    }));
  }, [cities, initialCities]);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (!selectedCountryId) {
      setValue("city", "");
    }
  }, [selectedCountryId, setValue]);

  const onSubmit: SubmitHandler<TSettingBasicInfoSchema> = async (data) => {
    const parsedPhone = parsePhoneNumber(data.phoneNumber);

    if (!parsedPhone) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    try {
      setIsSaving(true);

      const formData = new FormData();
      formData.append("locale", locale);
      formData.append("name", data.fullName.trim());
      formData.append("phone", parsedPhone.nationalNumber ?? "");
      formData.append("phone_code", `+${parsedPhone.countryCallingCode ?? ""}`);
      formData.append("job_title_id", data.jobTitle);
      formData.append("specialty_id", data.specialty);
      formData.append("country_id", data.country);
      formData.append("city_id", data.city);
      formData.append("experience_id", data.yearsOfExperience);
      formData.append("birth_date", data.dateOfBirth);

      if (data.profileImage[0] instanceof File) {
        formData.append("image", data.profileImage[0]);
      }

      if (data.uploadCV[0] instanceof File) {
        formData.append("cv", data.uploadCV[0]);
      }

      const response = await updateCandidateBasicInfoAction(formData);
      toast.success(response.message ?? "Profile updated successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile information.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-5">
      <div className="flex w-full flex-col">
        <h3 className="mx-1 mb-1 font-semibold text-base">Profile Picture</h3>
        <Controller
          name="profileImage"
          control={control}
          render={({ field }) => (
            <ProfileImage
              value={field.value?.length ? field.value : profile.image}
              onChange={field.onChange}
              error={Boolean(errors.profileImage?.message)}
            />
          )}
        />
      </div>

      <InputField
        id="fullName"
        label="Full Name"
        type="text"
        placeholder="ex: JooCore"
        {...register("fullName")}
        error={errors.fullName?.message}
      />

      <InputField
        id="email"
        type="email"
        label="Email"
        placeholder="ex: mail@mail.com"
        disabled
        {...register("email")}
        error={errors.email?.message}
      />

      <div>
        <label htmlFor="phoneNumber" className="mx-1 mb-1 block font-semibold">
          Phone number
        </label>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <PhoneInputCode
              defaultCountry="EG"
              id="phoneNumber"
              className="w-full"
              placeholder="ex:52 987 6543"
              value={field.value}
              onChange={(value) => field.onChange(value)}
              error={Boolean(errors.phoneNumber?.message)}
            />
          )}
        />
        {errors.phoneNumber ? (
          <span className="mt-1 text-[12px] text-red-500">
            {errors.phoneNumber.message}
          </span>
        ) : null}
      </div>

      <Controller
        name="jobTitle"
        control={control}
        render={({ field }) => (
          <SelectInputField
            id="jobTitle"
            label="Job Title"
            placeholder="ex: Consultant Internist"
            {...field}
            error={errors.jobTitle?.message}
            options={jobTitles.map((jobTitle) => ({
              label: jobTitle.label,
              value: jobTitle.id,
            }))}
          />
        )}
      />

      <div className="flex flex-col items-center gap-2 lg:flex-row">
        <Controller
          name="specialty"
          control={control}
          render={({ field }) => (
            <SelectInputField
              label="Specialty"
              id="specialty"
              placeholder="ex: Cardiology"
              {...field}
              error={errors.specialty?.message}
              options={specialties.map((specialty) => ({
                label: specialty.label,
                value: specialty.id,
              }))}
            />
          )}
        />
        <Controller
          name="yearsOfExperience"
          control={control}
          render={({ field }) => (
            <SelectInputField
              label="Years of Experience"
              id="yearsOfExperience"
              placeholder="ex: 3-5 years"
              {...field}
              error={errors.yearsOfExperience?.message}
              options={experiences.map((experience) => ({
                label: experience.label,
                value: experience.id,
              }))}
            />
          )}
        />
      </div>

      <div>
        <label htmlFor="country" className="mx-1 mb-2 block font-semibold">
          Current Location
        </label>
        <div className="flex items-center gap-2">
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="country"
                placeholder="country"
                {...field}
                error={errors.country?.message}
                options={countries.map((country) => ({
                  label: country.label,
                  value: country.id,
                }))}
              />
            )}
          />
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <SelectInputField
                id="city"
                placeholder="city"
                {...field}
                error={errors.city?.message}
                options={cityOptions}
                disabled={!selectedCountryId || isCitiesLoading}
              />
            )}
          />
        </div>
      </div>

      <InputField
        id="dateOfBirth"
        type="date"
        label="Date of birth"
        {...register("dateOfBirth")}
        error={errors.dateOfBirth?.message}
      />

      {profile.cv ? (
        <a
          href={profile.cv}
          target="_blank"
          rel="noreferrer"
          className="text-primary text-sm underline"
        >
          View current CV
        </a>
      ) : null}

      <Controller
        name="uploadCV"
        control={control}
        render={({ field }) => (
          <FilepondUpload
            label="Upload CV"
            hint={`"Optional"`}
            files={field.value}
            onChange={field.onChange}
            allowMultiple={false}
            maxFiles={1}
            error={errors.uploadCV?.message}
          />
        )}
      />

      <div className="flex justify-center items-center">
        <Button
          variant={"secondary"}
          hoverStyle={'slidePrimary'}
          size={'pill'}
          className='w-1/3 md:w-56'
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default BasicInfoForm;
