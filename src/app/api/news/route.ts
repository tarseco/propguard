import { NextResponse } from "next/server";

interface RawEvent {
  title: string;
  country: string;
  date: string;
  impact: "Low" | "Medium" | "High" | "Holiday" | string;
  forecast: string;
  previous: string;
}

export interface LiveNewsEvent {
  id: string;
  label: string;
  timestamp: number;
  country: string;
  impact: string;
}

const FEED_URL = "https://nfs.faireconomy.media/ff_calendar_thisweek.json";

export async function GET() {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: 300 },
      headers: { "User-Agent": "PropGuard-NewsFeed/1.0" },
    });

    if (!res.ok) {
      return NextResponse.json({ source: "unavailable", events: [] }, { status: 200 });
    }

    const raw = (await res.json()) as RawEvent[];
    const now = Date.now();

    const highImpactOnly: LiveNewsEvent[] = raw
      .filter((e) => e.impact === "High")
      .map((e) => ({
        id: `ff-${e.title}-${e.date}`,
        label: `${e.title} (${e.country})`,
        timestamp: new Date(e.date).getTime(),
        country: e.country,
        impact: e.impact,
      }))
      .filter((e) => Number.isFinite(e.timestamp) && e.timestamp > now - 1000 * 60 * 30)
      .sort((a, b) => a.timestamp - b.timestamp);

    // Near the end of the feed's weekly window, red-folder (High) events can
    // run out entirely — widen to Medium impact so the list isn't empty.
    const events =
      highImpactOnly.length >= 3
        ? highImpactOnly.slice(0, 20)
        : raw
            .filter((e) => e.impact === "High" || e.impact === "Medium")
            .map((e) => ({
              id: `ff-${e.title}-${e.date}`,
              label: `${e.title} (${e.country}${e.impact === "Medium" ? " · medium" : ""})`,
              timestamp: new Date(e.date).getTime(),
              country: e.country,
              impact: e.impact,
            }))
            .filter((e) => Number.isFinite(e.timestamp) && e.timestamp > now - 1000 * 60 * 30)
            .sort((a, b) => a.timestamp - b.timestamp)
            .slice(0, 20);

    return NextResponse.json({ source: "forexfactory", events });
  } catch {
    return NextResponse.json({ source: "unavailable", events: [] }, { status: 200 });
  }
}
