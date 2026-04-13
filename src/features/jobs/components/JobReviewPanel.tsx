import React from "react";
import { JobFormData } from "../validation/job-post-schema";
import Image from "next/image";
import { Badge } from "@/shared/components/ui/badge";
import JobOverviewCard from "./company/JobOverviewCard";
import JobLocationAndSalaryCard from "./company/JobLocationAndSalaryCard";
import JobEducationAndCertificationsCard from "./company/JobEducationAndCertificationsCard";
import { JobDetails } from "../types/jobs.types";

export default function JobReviewPanel({
  data,
  job,
}: {
  data: JobFormData;
  job: JobDetails | null;
}) {
  if (!job) {
    return (
      <section className="p-6">
        <p className="text-muted-foreground text-sm">
          No preview data yet. Complete step 2 successfully to load job details.
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="mt-5 flex items-center gap-6 p-4">
        <Image
          src="/assets/comp-logo.svg"
          alt="Company logo"
          width={96}
          height={86}
        />

        <div>
          <h6 className="text-foreground text-2xl font-semibold">
            {job.title ?? job.job_title?.title ?? data.title}
          </h6>
          <p>
            <span className="text-muted-foreground text-lg font-normal">
              at {job.company?.name ?? "Company"}
            </span>{" "}
            <Badge size="md" className="rounded-sm bg-[#0BA02C]">
              {job.employment_type?.title?.toUpperCase() ?? "N/A"}
            </Badge>{" "}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 p-7 md:grid-cols-3">
        <div className="font-noto-sans col-span-2 text-[#212529]">
          <h3 className="text-primary mb-4 text-xl font-bold">
            Job description
          </h3>
          <div
            className="prose prose-sm max-w-none border-b pb-5"
            dangerouslySetInnerHTML={{
              __html:
                job.description ||
                "<p>No description available.</p>",
            }}
          />
          <div>
            <h3 className="text-primary font-outfit mt-5 text-xl font-bold">
              Skills:
            </h3>
            <ul className="dashed-list mt-5 flex flex-col gap-1.5 ps-7 text-sm">
              {(job.skills ?? []).map((skill) => (
                <li key={skill.id}>{skill.title}</li>
              ))}
              {job.skills?.length === 0 && <li>No skills selected.</li>}
            </ul>
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-8">
          <JobLocationAndSalaryCard job={job} />
          <JobOverviewCard job={job} />
          <JobEducationAndCertificationsCard job={job} />
        </div>
      </div>
    </section>
  );
}
