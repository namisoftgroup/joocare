import BasicInfoForm from "@/features/candidate-settings/components/basic-info/BasicInfoForm";
import { getCandidateProfile } from "@/features/candidate-profile/services/profile-service";
import {
  getCandidateBasicInfoOptions,
  mapCandidateProfileToSettingsProfile,
} from "@/features/candidate-settings/services/basic-info-service";

const BasicInfoPage = async () => {
    const profile = await getCandidateProfile();

    if (!profile) {
        return (
            <main className="rounded-2xl bg-white p-6">
                <p className="text-sm text-muted-foreground">Unable to load profile information.</p>
            </main>
        );
    }

    const options = await getCandidateBasicInfoOptions(profile.countryId ?? "");

    if (!options) {
        return (
            <main className="rounded-2xl bg-white p-6">
                <p className="text-sm text-muted-foreground">Unable to load profile information.</p>
            </main>
        );
    }

    return (
        <main className="rounded-2xl bg-white p-6">
            <BasicInfoForm
                profile={mapCandidateProfileToSettingsProfile(profile)}
                jobTitles={options.jobTitles}
                specialties={options.specialties}
                experiences={options.experiences}
                countries={options.countries}
                initialCities={options.cities}
            />
        </main>
    );
};

export default BasicInfoPage;
