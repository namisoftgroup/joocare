import Image from "next/image";

export default function SectionTitle({
  sectionTitle,
}: {
  sectionTitle: string;
}) {
  return (
    <div className="border-primarySoft bg-soft-overlay flex w-fit items-center gap-2 rounded-lg border px-4 py-2">
      <Image
        src="/assets/icons/section-title-icon.svg"
        width={16}
        height={16}
        alt="section title icon"
      />
      <h2 className="text-secondary text-md font-normal">{sectionTitle}</h2>
    </div>
  );
}
