interface PagePlaceholderProps {
  title: string;
  description: string;
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-[16px] border border-border bg-white p-8">
      <h2 className="text-section-title">{title}</h2>
      <p className="font-body text-sm text-stat-label">{description}</p>
    </div>
  );
}
