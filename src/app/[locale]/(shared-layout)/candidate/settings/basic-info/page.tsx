import BasicInfoForm from "@/features/candidate-settings/components/basic-info/BasicInfoForm";
import { getCandidateBasicInfoPageData } from "@/features/candidate-settings/services/basic-info-service";

const BasicInfoPage = async () => {
    const data = await getCandidateBasicInfoPageData();

    if (!data) {
        return (
            <main className="rounded-2xl bg-white p-6">
                <p className="text-sm text-muted-foreground">Unable to load profile information.</p>
            </main>
        );
    }

    return (
        <main className="rounded-2xl bg-white p-6">
            <BasicInfoForm
                profile={data.profile}
                jobTitles={data.jobTitles}
                specialties={data.specialties}
                experiences={data.experiences}
                countries={data.countries}
                initialCities={data.cities}
            />
        </main>
    );
};

export default BasicInfoPage;
