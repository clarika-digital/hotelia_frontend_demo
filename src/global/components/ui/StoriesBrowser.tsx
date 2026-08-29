"use client";

import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllStories, getStoryTags } from "@/data/stories";
import type { Story } from "@/data/types";
import { StoryCard } from "@/global/components/ui/cards";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/cn";

const PAGE_SIZE = 6;

export type SortKey = "newest" | "oldest" | "title" | "reading-time";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "title", label: "Title A\u2013Z" },
  { key: "reading-time", label: "Read time" },
];

const DEFAULT_SORT: SortKey = "newest";

function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / PAGE_SIZE));
}

export function StoriesBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const tag = searchParams.get("tag") ?? "All";
  const sort = (searchParams.get("sort") as SortKey) || DEFAULT_SORT;
  const page = Math.max(
    1,
    Number(searchParams.get("page") ?? 1) || 1
  );

  const [inputValue, setInputValue] = useState(query);
  const deferredQuery = useDeferredValue(inputValue.trim().toLowerCase());

  const updateParams = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([key, value]) => {
        if (value === null || value === "" || value === "All" || value === DEFAULT_SORT) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      });
      const qs = next.toString();
      router.replace(qs ? `?${qs}` : "/stories/", { scroll: false });
    },
    [router, searchParams]
  );

  const tags = useMemo(() => ["All", ...getStoryTags()], []);

  const filtered = useMemo(() => {
    let items: Story[] = getAllStories();

    if (tag !== "All") {
      items = items.filter((s) => s.tag === tag);
    }

    if (deferredQuery) {
      items = items.filter((s) =>
        [s.title, s.excerpt, s.tag ?? "", s.body.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(deferredQuery)
      );
    }

    switch (sort) {
      case "newest":
        items = [...items].sort((a, b) => b.date.localeCompare(a.date));
        break;
      case "oldest":
        items = [...items].sort((a, b) => a.date.localeCompare(b.date));
        break;
      case "title":
        items = [...items].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "reading-time":
        items = [...items].sort((a, b) => {
          const at = Number((a.readTime ?? "0").match(/\d+/)?.[0] ?? 0);
          const bt = Number((b.readTime ?? "0").match(/\d+/)?.[0] ?? 0);
          return at - bt;
        });
        break;
    }

    return items;
  }, [tag, deferredQuery, sort]);

  const totalPages = useMemo(() => pageCount(filtered.length), [filtered.length]);
  const safePage = Math.min(page, totalPages);

  const visible = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage]
  );

  const activeFilters =
    tag !== "All" || deferredQuery !== "" || sort !== DEFAULT_SORT;

  const clearAll = () => {
    setInputValue("");
    updateParams({ q: null, tag: null, sort: null, page: null });
  };

  const setTag = (nextTag: string) =>
    updateParams({ tag: nextTag === "All" ? null : nextTag, page: null });

  const setSort = (nextSort: string) =>
    updateParams({
      sort: nextSort === DEFAULT_SORT ? null : nextSort,
      page: null,
    });

  const goToPage = (next: number) =>
    updateParams({ page: next === 1 ? null : String(next) });

  return (
    <div>
      {/* Controls */}
      <div className="mb-8 rounded-2xl border border-surface-muted bg-white p-5 shadow-sm md:p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          {/* Search */}
          <label className="relative block">
            <span className="sr-only">Search stories</span>
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
            </svg>
            <input
              type="search"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                updateParams({ q: e.target.value || null, page: null });
              }}
              placeholder="Search stories, tags &amp; topics\u2026"
              className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-brand-navy placeholder:text-gray-400 outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30"
            />
          </label>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
              Sort
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-brand-navy outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tag filters */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(t)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition",
                tag === t
                  ? "bg-brand-gold text-white shadow-sm"
                  : "bg-surface-muted text-brand-navy hover:bg-brand-gold/15"
              )}
            >
              {t}
              <span className="ml-1.5 opacity-60">
                {t === "All"
                  ? getAllStories().length
                  : getAllStories().filter((s) => s.tag === t).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Meta row */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          {filtered.length === 0 ? (
            <>No stories found</>
          ) : (
            <>
              Showing
              <span className="font-semibold text-brand-navy">
                {" "}
                {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}
                {"\u2013"}
                {Math.min(safePage * PAGE_SIZE, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-brand-navy">
                {filtered.length}
              </span>{" "}
              stor{filtered.length === 1 ? "y" : "ies"}
            </>
          )}
        </p>
        {activeFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm font-semibold text-brand-gold hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="rounded-2xl bg-surface-muted py-20 text-center">
          <p className="font-display text-2xl text-brand-navy">
            Nothing matches your search
          </p>
          <p className="mt-2 text-gray-500">
            Try a different keyword or clear the filters.
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-6 rounded-lg bg-brand-gold px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-goldLight"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((story) => (
            <StoryCard key={story.slug} story={story} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Stories pagination"
          className="mt-12 flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => goToPage(safePage - 1)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-brand-navy transition hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            &larr; Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => goToPage(p)}
              aria-current={p === safePage ? "page" : undefined}
              className={cn(
                "h-10 w-10 rounded-lg text-sm font-semibold transition",
                p === safePage
                  ? "bg-brand-gold text-white shadow-sm"
                  : "border border-slate-200 bg-white text-brand-navy hover:border-brand-gold hover:text-brand-gold"
              )}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => goToPage(safePage + 1)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-brand-navy transition hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next &rarr;
          </button>
        </nav>
      )}

      {/* Read-time footnote */}
      <p className="mt-6 text-center text-xs text-gray-400">
        Latest story: {formatDate(getAllStories()[0].date)}
      </p>
    </div>
  );
}