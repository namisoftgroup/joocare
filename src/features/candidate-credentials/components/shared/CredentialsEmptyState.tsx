"use client";

type CredentialsEmptyStateProps = {
  title: string;
  description: string;
};

export default function CredentialsEmptyState({
  title,
  description,
}: CredentialsEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed bg-white px-6 py-10 text-center shadow-sm">
      <h2 className="text-lg font-semibold text-black">{title}</h2>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>
    </div>
  );
}
