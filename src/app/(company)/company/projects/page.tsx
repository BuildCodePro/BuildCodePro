import type { Metadata } from "next";

import { HeroBanner } from "@/components/dashboard";
import { ProjectsContent } from "@/components/projects/projects-content";

export const metadata: Metadata = {
    title: "Projects",
    description: "View and manage your fire alarm estimation projects",
};

export default function ProjectsPage() {
    return (
        <div className="flex w-full flex-col gap-6">
            <HeroBanner />
            <ProjectsContent />
        </div>
    );
}