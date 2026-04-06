"use client"
import { Edit2, Plus } from "lucide-react"
import { useState } from "react"
import OneSkillSection from "./OneSkillSection"
import { AddSkillsModal } from "./AddSkillsModal"
import { EditSkillsModal } from "./EditSkillsModal"
import { CandidateProfileViewModel } from "../../services/profile.service"


const SkillsSection = ({
    profile,
}: {
    profile: CandidateProfileViewModel | null
}) => {
    const [addOpen, setAddOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)

    const [skills, setSkills] = useState<string[]>(profile?.skills ?? [])
    return (
        <>
            <section className="rounded-2xl bg-white flex flex-col gap-5 p-4 border">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Skills</h3>

                    <div className="flex items-center gap-4">
                        <Plus size={22} onClick={() => setAddOpen(true)} className="cursor-pointer" />
                        <Edit2 size={22} onClick={() => setEditOpen(true)} className="cursor-pointer" />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {skills.length > 0 ? skills.map((skill) => (
                        <OneSkillSection key={skill} label={skill} />
                    )) : (
                        <p className="text-sm text-muted-foreground">No skills added yet.</p>
                    )}
                </div>
            </section>

            <AddSkillsModal
                open={addOpen}
                onOpenChange={setAddOpen}
                onSave={(newSkills) => setSkills(newSkills)}
            />

            <EditSkillsModal
                open={editOpen}
                onOpenChange={setEditOpen}
                skills={skills}
                onSave={(updated) => setSkills(updated)}
            />
        </>
    )
}

export default SkillsSection
