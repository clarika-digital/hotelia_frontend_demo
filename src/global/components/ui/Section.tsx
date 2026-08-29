interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ title, subtitle, children, className = "", id }: SectionProps) {
  return (
    <section className={`py-14 ${className}`} id={id}>
      <div className="mx-auto max-w-6xl px-5">
        {title && (
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl text-brand-navy">{title}</h2>
            {subtitle && (
              <p className="mt-2 text-gray-500 max-w-2xl mx-auto">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
