interface HeroProps {
  title: string;
  subtitle?: string;
  image: string;
  height?: string;
}

export function Hero({ title, subtitle, image, height = "h-[420px]" }: HeroProps) {
  return (
    <div
      className={`${height} relative flex items-center justify-center bg-cover bg-center`}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 bg-brand-navyDark/50" />
      <div className="relative text-center text-white px-5">
        <h1 className="text-4xl md:text-5xl tracking-wide drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-lg text-gray-100 drop-shadow">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
