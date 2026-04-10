export type JobStatus = "open" | "closed" | "paused";
export type Applicant = {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  cvUrl: string;
};

// Candidate jobs

export type JobsFilterOption = {
  value: string;
  label: string;
};

export interface FilterState {
  professionalLicense: string;
  roleCategories: string[];
  seniorityLevels: string[];
  domains: string[];
  specialties: string[];
  experiences: string[];
  availabilities: string[];
  categories: string[];
  employmentTypes: string[];
  salaryTypes: string[];
  salaryMin: string;
  salaryMax: string;
}

export interface AccordionSection {
  key: keyof Omit<FilterState, "salaryMin" | "salaryMax">;
  label: string;
  name: string;
  options: JobsFilterOption[];
  type?: "checkbox" | "radio";
}
