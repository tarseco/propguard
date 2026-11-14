"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Plus, Radio, Trash2 } from "lucide-react";
import FirmSelector from "./FirmSelector";
import { getFirm, demoNewsEvents, NewsEvent } from "@/lib/propfirms";

function playBeep(frequency: number, duration: number) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
    osc.onended = () => ctx.close();
  } catch {
    // audio unavailable, fail silently
  }
}

function formatDuration(ms: number): string {
  const abs = Math.abs(ms);
  const totalSeconds = Math.floor(abs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

export default function NewsBlackoutGuard() {
  const [firmId, setFirmId] = useState("ftmo");
  const firm = getFirm(firmId);

  const [now, setNow] = useState<number>(() => Date.now());
  const [events, setEvents] = useState<NewsEvent[]>(() => demoNewsEvents(Date.now()));
  const [newLabel, setNewLabel] = useState("");
  const [newTime, setNewTime] = useState("");

  const warnedRef = useRef<Set<string>>(new Set());
  const alertedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const upcoming = useMemo(() => {
    if (now === null) return [];
    return events
      .filter((e) => e.timestamp > now - 1000 * 60 * 30)
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [events, now]);

  const nextEvent = upcoming[0];
  const blackoutMs = firm.newsBlackoutMinutes * 60 * 1000;

  const status = useMemo(() => {
    if (!nextEvent || now === null) return null;
    const diff = nextEvent.timestamp - now; // positive = before event
    const inBlackout = Math.abs(diff) <= blackoutMs && blackoutMs > 0;
    const blackoutStart = nextEvent.timestamp - blackoutMs;
    const blackoutEnd = nextEvent.timestamp + blackoutMs;
    const soon = !inBlackout && diff > 0 && diff <= blackoutMs + 1000 * 60 * 3;
    return { diff, inBlackout, blackoutStart, blackoutEnd, soon };
  }, [nextEvent, now, blackoutMs]);

  useEffect(() => {
    if (!status || !nextEvent) return;
    if (status.inBlackout && !alertedRef.current.has(nextEvent.id)) {
      alertedRef.current.add(nextEvent.id);
      playBeep(880, 0.35);
      setTimeout(() => playBeep(880, 0.35), 450);
    }
    if (status.soon && !warnedRef.current.has(nextEvent.id)) {
      warnedRef.current.add(nextEvent.id);
      playBeep(520, 0.25);
    }
  }, [status, nextEvent]);

  function addEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!newLabel || !newTime) return;
    const ts = new Date(newTime).getTime();
    if (Number.isNaN(ts)) return;
    setEvents((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, label: newLabel, timestamp: ts, custom: true },
    ]);
    setNewLabel("");
    setNewTime("");
  }

  function removeEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-[#0b0f14] p-5">
            <FirmSelector value={firmId} onChange={setFirmId} />
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0b0f14] p-5">
            <h3 className="text-sm font-semibold text-slate-200">
              {firm.name} — hidden rule cheat sheet
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">News blackout window</dt>
                <dd className="font-mono font-semibold text-slate-100">
                  {firm.newsBlackoutMinutes > 0
                    ? `±${firm.newsBlackoutMinutes} min`
                    : "No fixed rule"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Weekend holding</dt>
                <dd
                  className={`font-semibold ${
                    firm.weekendHoldingAllowed ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {firm.weekendHoldingAllowed ? "Allowed" : "Must flatten"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Consistency cap</dt>
                <dd className="font-mono font-semibold text-slate-100">
                  {firm.consistencyMaxPercent !== null
                    ? `${firm.consistencyMaxPercent}%`
                    : "No hard rule"}
                </dd>
              </div>
              <div className="border-t border-slate-800 pt-3 text-slate-400">
                {firm.maxLotNote}
              </div>
              <div className="rounded-lg bg-slate-900/60 p-3 text-xs text-slate-500">
                {firm.payoutNote}
              </div>
            </dl>
          </div>
        </div>

        <div className="space-y-6">
          {status && nextEvent && (
            <div
              className={`rounded-xl border p-6 transition-colors ${
                status.inBlackout
                  ? "alert-pulse border-red-500 bg-red-950/40"
                  : status.soon
                  ? "border-amber-500/60 bg-amber-950/20"
                  : "border-emerald-700/50 bg-emerald-950/10"
              }`}
            >
              <div className="flex items-center gap-2">
                {status.inBlackout ? (
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                ) : (
                  <Radio className="h-5 w-5 text-emerald-400" />
                )}
                <span
                  className={`text-lg font-extrabold tracking-wide ${
                    status.inBlackout ? "text-red-400" : "text-slate-100"
                  }`}
                >
                  {status.inBlackout
                    ? "DO NOT TRADE: NEWS WINDOW ACTIVE"
                    : status.soon
                    ? "NEWS WINDOW APPROACHING"
                    : "CLEAR TO TRADE"}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">Next event</p>
                  <p className="text-xl font-bold text-slate-100">{nextEvent.label}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">
                    {status.inBlackout ? "Blackout ends in" : "Time to event"}
                  </p>
                  <p className="font-mono text-3xl font-extrabold text-slate-50">
                    {formatDuration(
                      status.inBlackout ? status.blackoutEnd - (now ?? 0) : status.diff,
                    )}
                  </p>
                </div>
              </div>

              {blackoutMs > 0 && !status.inBlackout && (
                <p className="mt-3 text-xs text-slate-500">
                  Trading locks ±{firm.newsBlackoutMinutes} min around this event for{" "}
                  {firm.name}.
                </p>
              )}
            </div>
          )}

          <div className="rounded-xl border border-slate-800 bg-[#0b0f14] p-5">
            <h3 className="text-sm font-semibold text-slate-200">Upcoming news</h3>
            <div className="mt-4 space-y-2">
              {upcoming.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-200">{event.label}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-slate-400">
                      {now !== null ? formatDuration(event.timestamp - now) : "--"}
                    </span>
                    {event.custom && (
                      <button
                        onClick={() => removeEvent(event.id)}
                        className="text-slate-500 hover:text-red-400"
                        aria-label="Remove event"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {upcoming.length === 0 && (
                <p className="text-sm text-slate-500">No upcoming events.</p>
              )}
            </div>

            <form onSubmit={addEvent} className="mt-4 flex flex-col gap-2 border-t border-slate-800 pt-4 sm:flex-row">
              <input
                type="text"
                placeholder="Event name (e.g. ECB Rate Decision)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-500"
              />
              <input
                type="datetime-local"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-1 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
