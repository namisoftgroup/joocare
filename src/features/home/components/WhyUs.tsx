import React from "react";
import SectionTitle from "./SectionTitle";
import { Search } from "lucide-react";
import Image from "next/image";
import Cons from "./Cons";
import Pros from "./Pros";

export default function WhyUs() {
  return (
    <section className="bg-white px-0 py-20">
      <div className="mb-8 flex flex-col items-center space-y-4">
        <SectionTitle sectionTitle="Why Joocare?" />
        <h2 className="text-secondary text-center text-3xl font-bold md:text-4xl">
          Why Traditional Hiring Models No Longer <br /> Serve Healthcare
        </h2>
      </div>
      <div className="grid grid-cols-10">
        <div className="bg-container-gray col-span-4 flex flex-col py-12 pl-22">
          <Cons />
        </div>
        <div className="relative col-span-2">
          <Image
            src="/assets/why-container.svg"
            fill
            alt=""
            className="object-cover"
          />
        </div>
        <div className="bg-container col-span-4 flex flex-col py-12 pl-8 text-white">
          <Pros />
        </div>
      </div>
    </section>
  );
}
