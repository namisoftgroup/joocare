import Hero from "@/features/home/components/Hero";
import HowItWorks from "@/features/home/components/HowItWorks";
import { ImpactSection } from "@/features/home/components/ImpactSection";
import TopEmployers from "@/features/home/components/TopEmployers";

export default function Home() {
  return (
    <section className="">
      <Hero />
      <HowItWorks />
      <TopEmployers />
      <ImpactSection />
    </section>
  );
}
