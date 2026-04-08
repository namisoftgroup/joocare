export type CandidateProfileViewModel = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  phoneCode: string | null;
  fullPhone: string | null;
  jobTitleId?: string | null;
  specialtyId?: string | null;
  experienceId?: string | null;
  countryId?: string | null;
  cityId?: string | null;
  birthDate?: string | null;
  image: string | null;
  cv: string | null;
  bio: string | null;
  age: number | null;
  location: string | null;
  jobTitle: string | null;
  skills: CandidateSkillViewModel[];
  educations: CandidateEducationViewModel[];
  experiences: CandidateExperienceViewModel[];
};

export type CandidateSkillViewModel = {
  id: string;
  label: string;
  deleteId?: string;
};

export type CandidateEducationViewModel = {
  id: string;
  university: string;
  degree: string | null;
  period: string | null;
  countryId: string | null;
  startDate: string | null;
  endDate: string | null;
};

export type CandidateExperienceViewModel = {
  id: string;
  title: string;
  organization: string | null;
  startDate: string | null;
  endDate: string | null;
  startDateLabel: string | null;
  endDateLabel: string | null;
  isCurrent: boolean;
  bullets: string[];
};
