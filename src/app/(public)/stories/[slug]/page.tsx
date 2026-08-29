import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero } from "@/global/components/layout/Hero";
import { getAllStories } from "@/data/stories";
import { formatDate } from "@/lib/formatters";

export function generateStaticParams() {
  return getAllStories().map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const story = getAllStories().find((s) => s.slug === params.slug);
  return { title: story?.title ?? "Story" };
}

export default function StoryDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const story = getAllStories().find((s) => s.slug === params.slug);

  if (!story) notFound();

  return (
    <>
      <Hero title={story.title} image={story.image} height="h-[380px]" />
      <div className="mx-auto max-w-3xl px-5 py-14">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          {story.tag && (
            <span className="rounded-full bg-brand-gold/10 px-3 py-1 text-brand-gold">
              {story.tag}
            </span>
          )}
          <span>{formatDate(story.date)}</span>
          {story.readTime && <span>&middot; {story.readTime}</span>}
        </div>
        <p className="mt-6 text-lg text-gray-600 italic leading-relaxed">
          {story.excerpt}
        </p>
        <div className="mt-6 space-y-5">
          {story.body.map((para, i) => (
            <p key={i} className="text-gray-700 leading-relaxed">
              {para}
            </p>
          ))}
        </div>
        <div className="mt-10">
          <Link href="/stories/" className="text-brand-gold font-semibold hover:underline">
            &larr; Back to Stories
          </Link>
        </div>
      </div>
    </>
  );
}
