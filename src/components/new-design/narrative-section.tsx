import type { DesignNarrativeSection } from "@/types/new-design";

interface NarrativeSectionProps {
  section: DesignNarrativeSection;
}

export function NarrativeSection({ section }: NarrativeSectionProps) {
  return (
    <section className="space-y-2">
      <h4 className="text-narrative-section-title">{section.title}</h4>
      <p className="text-narrative-body">{section.content}</p>
    </section>
  );
}
