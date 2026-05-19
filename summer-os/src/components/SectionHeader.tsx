interface SectionHeaderProps {
  title: string;
  accent: string;
  children?: React.ReactNode;
}

export function SectionHeader({ title, accent, children }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1
        className="text-2xl font-bold tracking-tight"
        style={{ color: accent }}
      >
        {title}
      </h1>
      {children}
    </div>
  );
}
