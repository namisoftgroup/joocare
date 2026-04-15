import StepOne from "../steps/step-one";
import StepThree from "../steps/step-three";
import StepTwo from "../steps/step-two";
import { StepConfig, WizardFormData } from "../types/wizard.types";

export const steps: StepConfig[] = [
  {
    component: StepOne,
    fields: [
      "name",
      "email",
      "domain_id",
      "person_name",
      "person_phone",
    ],
  },
  {
    component: StepTwo,
    fields: [
      "commercialRegister",
      "issuingCountryLicense",
      "organizationSize",
      "commercialRegistrationIssueDate",
      "commercialRegistrationExpiryDate",
      "commercialRegistrationImage",
      "employerType",
      "medicalFacilityLicenseNumber",
      "licenseIssuingAuthority",
      "specialtyScopePractice",
      "medicalRegistrationIssueDate",
      "medicalRegistrationExpiryDate",
      "medicalLicenseImage",
    ],
  },
  {
    component: StepThree,
    fields: [
      "uploadCoverImage",
      "uploadLogoImage",
      "organizationPhoneNumber",
      "organizationCountry",
      "organizationCity",
      "dateOfEstablishment",
      "aboutOrganization",
    ],
  },
];

export const defaultValuesWizard: WizardFormData = {
  // default data step one
  name: "",
  email: "",
  domain_id: "",
  person_name: "",
  person_phone: "",

  // default data step two
  commercialRegister: "",
  issuingCountryLicense: "",
  organizationSize: "",
  commercialRegistrationIssueDate: undefined as unknown as Date,
  commercialRegistrationExpiryDate: undefined as unknown as Date,
  commercialRegistrationImage: [],
  employerType: "",
  medicalFacilityLicenseNumber: "",
  licenseIssuingAuthority: "",
  specialtyScopePractice: "",
  medicalRegistrationIssueDate: undefined as unknown as Date,
  medicalRegistrationExpiryDate: undefined as unknown as Date,
  medicalLicenseImage: [],

  // default data step three
  uploadCoverImage: "",
  uploadLogoImage: "",
  organizationPhoneNumber: "",
  organizationCountry: "",
  organizationCity: "",
  dateOfEstablishment: "",
  aboutOrganization: "",

};
