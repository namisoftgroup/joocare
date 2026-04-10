import Banner from "@/features/forEmployers/Banner";
import EmployersHero from "@/features/forEmployers/EmployersHero";
import FAQ from "@/features/forEmployers/FAQ";
import Hire from "@/features/forEmployers/Hire";
import Why from "@/features/forEmployers/Why";
import PlainBreadcrumb from "@/shared/components/PlainBreadcramb";

export default function ForEmployers() {
  return (
    <>
      <PlainBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "For Employers" }]}
      />
      <section className="px-3 lg:px-25">
        <section className="container mx-auto">
          <EmployersHero />
          <Banner />
          <Why />
          <Hire />
          <FAQ />
        </section>
      </section>
    </>
  );
}
