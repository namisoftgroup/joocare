import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Applicant } from "../index.types";
import ApplicantRow from "./ApplicantRow";

// ─── Types ────────────────────────────────────────────────────────────────────
type ApplicantsTableProps = {
  applicants: Applicant[];
  onDownload?: (applicant: Applicant) => void;
  onView?: (applicant: Applicant) => void;
};

export default function ApplicantsTable({
  applicants,
  onDownload,
  onView,
}: ApplicantsTableProps) {
  return (
    <div className="border-border mt-4 w-full overflow-x-auto rounded-2xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#E4E5E8] bg-white hover:bg-white">
            {["#", "Name", "Email", "Phone", "Date", "Cv"].map((col) => (
              <TableHead
                key={col}
                className="px-4 py-5 text-sm font-semibold text-[#18191C]"
              >
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {applicants.map((applicant) => (
            <ApplicantRow
              key={applicant.id}
              applicant={applicant}
              onDownload={onDownload}
              onView={onView}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
