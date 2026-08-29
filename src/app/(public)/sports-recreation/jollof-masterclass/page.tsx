import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";

export const metadata: Metadata = { title: "The Jollof Masterclass" };

const steps = [
  { name: "1. The Base", detail: "Build a rich pepper-and-tomato sauce from the market's best." },
  { name: "2. The Toast", detail: "Roast aromatic spices and toast the rice for depth." },
  { name: "3. The Flame", detail: "Manage the open fire for that signature smoky finish." },
  { name: "4. The Taste", detail: "Sit down and judge the result together, fork at the ready." },
];

export default function JollofMasterclassPage() {
  return (
    <>
      <Hero
        title="The Jollof Masterclass"
        subtitle="Master the Dish Everyone Argues Over"
        image="/images/ghana/banner-dining.jpg"
      />
      <div className="mx-auto max-w-3xl px-5 py-14">
        <p className="text-lg text-gray-600 leading-relaxed">
          There is no more debated dish in West Africa than jollof — and our
          version is the pride of the house. In this signature masterclass you
          will build it from scratch over open flame, exactly the way our
          kitchens do.
        </p>
        <p className="mt-4 text-gray-600 leading-relaxed">
          You&apos;ll leave with the definitive recipe, the technique to nail
          the flame, and the confidence to defend your jollof anywhere.
        </p>
        <h2 className="mt-8 font-display text-2xl text-brand-navy">The Method</h2>
        <div className="mt-4 space-y-3">
          {steps.map((s) => (
            <div key={s.name} className="rounded bg-surface-muted p-4">
              <div className="font-semibold text-brand-navy">{s.name}</div>
              <div className="mt-1 text-sm text-gray-600">{s.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
