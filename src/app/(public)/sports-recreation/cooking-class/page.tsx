import type { Metadata } from "next";
import { Hero } from "@/global/components/layout/Hero";

export const metadata: Metadata = { title: "Ghanaian Cooking Class" };

const highlights = [
  { name: "Hands & Pestle", detail: "Make your own pepper sauce and pound fufu to order." },
  { name: "The Stew Pot", detail: "Balance groundnut, palm nut and light-soup flavours from scratch." },
  { name: "Grill & Fry", detail: "Finish tilapia and kelewele over flame and hot oil." },
];

export default function CookingClassPage() {
  return (
    <>
      <Hero
        title="Ghanaian Cooking Class"
        subtitle="Cook the Ghanaian Table Together"
        image="/images/ghana/offer-jollof.jpg"
      />
      <div className="mx-auto max-w-3xl px-5 py-14">
        <p className="text-lg text-gray-600 leading-relaxed">
          Roll up your sleeves in our open kitchen and learn the recipes that
          hold the Ghanaian table together. Under the guidance of our chefs you
          will grind fresh pepper, pound your own fufu and build rich stews
          from scratch.
        </p>
        <p className="mt-4 text-gray-600 leading-relaxed">
          Classes keep to small groups so there is room at the stove for
          everyone — then you sit down together and enjoy what you have made.
        </p>
        <h2 className="mt-8 font-display text-2xl text-brand-navy">What You'll Learn</h2>
        <div className="mt-4 space-y-3">
          {highlights.map((h) => (
            <div key={h.name} className="rounded bg-surface-muted p-4">
              <div className="font-semibold text-brand-navy">{h.name}</div>
              <div className="mt-1 text-sm text-gray-600">{h.detail}</div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-gray-600">
          Take home the recipes, and the confidence to recreate them in your
          own kitchen.
        </p>
      </div>
    </>
  );
}
