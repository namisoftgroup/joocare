import React from "react";
import HomeFilter from "./HomeFilter";
import PopularSearches from "./PopularSearches";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center gap-16 pt-30 pb-20 text-center">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-secondary mb-9 text-5xl leading-[1.3] font-bold">
          An Integrated Talent Platform for Healthcare and Life Sciences,
          <span className="text-primary"> Powered by AI </span>
        </h1>
        <p className="text-muted-foreground text-xl font-normal">
          Joocare enables healthcare and life sciences organizations to attract,
          evaluate, and hire qualified talent, while enabling professionals to
          access verified career opportunities through AI-enabled recruitment
          services
        </p>
      </div>
      <div className="flex w-full max-w-7xl flex-col items-center gap-18 px-3">
        <HomeFilter />
        <PopularSearches />
      </div>
    </section>
  );
}
