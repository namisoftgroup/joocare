export type CandidateProfileViewModel = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  phoneCode: string | null;
  fullPhone: string | null;
  image: string | null;
  cv: string | null;
  bio: string | null;
  age: number | null;
  location: string | null;
  jobTitle: string | null;
  skills: string[];
  educations: CandidateEducationViewModel[];
  experiences: CandidateExperienceViewModel[];
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
  bullets: string[];
};
