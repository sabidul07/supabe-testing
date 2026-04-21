"use client";

import { type FormEvent, useMemo, useState } from "react";

type DealStage = "Proposal" | "Review" | "Negotiation" | "Won";
type Period = "7D" | "30D" | "90D";

type Stat = {
  label: string;
  value: string;
  change: string;
  accent: string;
};

type Deal = {
  id: number;
  name: string;
  company: string;
  value: number;
  stage: DealStage;
};

type Activity = {
  id: number;
  text: string;
  time: string;
};

const periodStats: Record<Period, Stat[]> = {
  "7D": [
    { label: "Total Revenue", value: "$31.8K", change: "+7.4%", accent: "bg-emerald-400" },
    { label: "Active Users", value: "8,492", change: "+4.8%", accent: "bg-sky-400" },
    { label: "Conversion", value: "7.91%", change: "+1.2%", accent: "bg-amber-400" },
    { label: "Open Tickets", value: "42", change: "-4.1%", accent: "bg-rose-400" },
  ],
  "30D": [
    { label: "Total Revenue", value: "$128.4K", change: "+18.2%", accent: "bg-emerald-400" },
    { label: "Active Users", value: "24,892", change: "+12.7%", accent: "bg-sky-400" },
    { label: "Conversion", value: "8.42%", change: "+3.1%", accent: "bg-amber-400" },
    { label: "Open Tickets", value: "126", change: "-9.4%", accent: "bg-rose-400" },
  ],
  "90D": [
    { label: "Total Revenue", value: "$402.9K", change: "+28.6%", accent: "bg-emerald-400" },
    { label: "Active Users", value: "61,350", change: "+21.3%", accent: "bg-sky-400" },
    { label: "Conversion", value: "9.18%", change: "+4.7%", accent: "bg-amber-400" },
    { label: "Open Tickets", value: "318", change: "-13.8%", accent: "bg-rose-400" },
  ],
};

const periodBars: Record<Period, number[]> = {
  "7D": [48, 62, 54, 72, 68, 86, 78],
  "30D": [42, 68, 54, 86, 73, 92, 64, 78, 96, 88, 74, 90],
  "90D": [38, 44, 58, 53, 71, 69, 74, 83, 79, 91, 88, 96],
};

const initialDeals: Deal[] = [
  { id: 1, name: "Enterprise Plan", company: "Nova Labs", value: 42000, stage: "Negotiation" },
  { id: 2, name: "Growth Retainer", company: "Atlas Studio", value: 18500, stage: "Proposal" },
  { id: 3, name: "Analytics Suite", company: "BrightDesk", value: 31200, stage: "Review" },
];

const initialActivities: Activity[] = [
  { id: 1, text: "New signup from acme.io", time: "2 min ago" },
  { id: 2, text: "Invoice INV-2048 paid", time: "4 min ago" },
  { id: 3, text: "Team workspace upgraded", time: "7 min ago" },
  { id: 4, text: "Support SLA restored", time: "11 min ago" },
];

const stages: DealStage[] = ["Proposal", "Review", "Negotiation", "Won"];

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m21 21-4.35-4.35" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Dashboard() {
  const [period, setPeriod] = useState<Period>("30D");
  const [activeNav, setActiveNav] = useState("Overview");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<DealStage | "All">("All");
  const [target, setTarget] = useState(84);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unread, setUnread] = useState(3);
  const [newDeal, setNewDeal] = useState({
    name: "",
    company: "",
    value: "",
  });

  const filteredDeals = useMemo(() => {
    const query = search.trim().toLowerCase();

    return deals.filter((deal) => {
      const matchesStage = stageFilter === "All" || deal.stage === stageFilter;
      const matchesSearch =
        query.length === 0 ||
        deal.name.toLowerCase().includes(query) ||
        deal.company.toLowerCase().includes(query) ||
        deal.stage.toLowerCase().includes(query);

      return matchesStage && matchesSearch;
    });
  }, [deals, search, stageFilter]);

  const filteredActivities = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return activities;
    }

    return activities.filter((activity) =>
      activity.text.toLowerCase().includes(query)
    );
  }, [activities, search]);

  const pipelineValue = useMemo(
    () => deals.reduce((total, deal) => total + deal.value, 0),
    [deals]
  );

  const healthScore = Math.min(
    99,
    Math.round(76 + deals.filter((deal) => deal.stage === "Won").length * 5)
  );

  const addActivity = (text: string) => {
    setActivities((current) => [
      { id: Date.now(), text, time: "just now" },
      ...current.slice(0, 5),
    ]);
  };

  const handleAddDeal = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = Number(newDeal.value);

    if (!newDeal.name.trim() || !newDeal.company.trim() || !value) {
      return;
    }

    const deal: Deal = {
      id: Date.now(),
      name: newDeal.name.trim(),
      company: newDeal.company.trim(),
      value,
      stage: "Proposal",
    };

    setDeals((current) => [deal, ...current]);
    setNewDeal({ name: "", company: "", value: "" });
    addActivity(`${deal.company} added to pipeline`);
    setUnread((current) => current + 1);
  };

  const updateDealStage = (id: number, stage: DealStage) => {
    const deal = deals.find((item) => item.id === id);

    setDeals((current) =>
      current.map((item) => (item.id === id ? { ...item, stage } : item))
    );

    if (deal) {
      addActivity(`${deal.company} moved to ${stage}`);
      setUnread((current) => current + 1);
    }
  };

  const exportPipeline = () => {
    const rows = [
      ["Deal", "Company", "Value", "Stage"],
      ...filteredDeals.map((deal) => [
        deal.name,
        deal.company,
        String(deal.value),
        deal.stage,
      ]),
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "pipeline.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#111827]">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-[#dfe5ee] bg-[#101828] px-6 py-7 text-white lg:block">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-400 text-lg font-black text-[#101828]">
              S
            </div>
            <div>
              <p className="text-lg font-bold">Supabase HQ</p>
              <p className="text-sm text-slate-300">Command Center</p>
            </div>
          </div>

          <nav className="mt-10 space-y-2 text-sm font-medium">
            {["Overview", "Customers", "Analytics", "Messages", "Billing"].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveNav(item)}
                  className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition ${
                    activeNav === item
                      ? "bg-white text-[#101828]"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item}
                  {activeNav === item ? (
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  ) : null}
                </button>
              )
            )}
          </nav>

          <div className="mt-10 rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-300">Monthly Target</p>
            <p className="mt-2 text-3xl font-bold">{target}%</p>
            <div className="mt-4 h-2 rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-emerald-400"
                style={{ width: `${target}%` }}
              />
            </div>
            <input
              aria-label="Monthly target"
              type="range"
              min="20"
              max="100"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="mt-5 w-full accent-emerald-400"
            />
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex flex-col gap-4 border-b border-[#dfe5ee] bg-white px-5 py-5 md:flex-row md:items-center md:justify-between lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                {activeNav}
              </p>
              <h1 className="mt-1 text-3xl font-black text-[#101828] md:text-4xl">
                Business Overview
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#d8dee8] bg-[#f8fafc] px-3 py-2 text-slate-500 md:w-72">
                <SearchIcon />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#111827] outline-none placeholder:text-slate-400"
                  placeholder="Search"
                />
              </label>
              <div className="relative">
                <button
                  type="button"
                  aria-label="Notifications"
                  onClick={() => setShowNotifications((current) => !current)}
                  className="relative grid h-11 w-11 place-items-center rounded-lg border border-[#d8dee8] bg-white text-slate-600 shadow-sm"
                >
                  <BellIcon />
                  {unread > 0 ? (
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-xs font-bold text-white">
                      {unread}
                    </span>
                  ) : null}
                </button>
                {showNotifications ? (
                  <div className="absolute right-0 z-10 mt-3 w-80 rounded-lg border border-[#dfe5ee] bg-white p-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[#101828]">Notifications</p>
                      <button
                        type="button"
                        onClick={() => setUnread(0)}
                        className="text-sm font-semibold text-emerald-700"
                      >
                        Mark read
                      </button>
                    </div>
                    <div className="mt-4 space-y-3">
                      {activities.slice(0, 3).map((activity) => (
                        <div key={activity.id} className="rounded-lg bg-[#f8fafc] p-3">
                          <p className="text-sm font-semibold text-[#101828]">
                            {activity.text}
                          </p>
                          <p className="text-xs text-slate-500">{activity.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-[#101828] text-sm font-bold text-white">
                HP
              </div>
            </div>
          </header>

          <div className="space-y-6 px-5 py-6 lg:px-8">
            <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex rounded-lg border border-[#d8dee8] bg-white p-1">
                {(["7D", "30D", "90D"] as Period[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPeriod(item)}
                    className={`rounded-md px-4 py-2 text-sm font-bold ${
                      period === item
                        ? "bg-[#101828] text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <p className="text-sm font-semibold text-slate-600">
                Pipeline value: {formatCurrency(pipelineValue)}
              </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {periodStats[period].map((stat) => (
                <article
                  key={stat.label}
                  className="rounded-lg border border-[#dfe5ee] bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {stat.label}
                      </p>
                      <p className="mt-3 text-3xl font-black text-[#101828]">
                        {stat.value}
                      </p>
                    </div>
                    <span className={`h-3 w-3 rounded-full ${stat.accent}`} />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-emerald-700">
                    {stat.change} this period
                  </p>
                </article>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <article className="rounded-lg border border-[#dfe5ee] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-black text-[#101828]">
                      Revenue Momentum
                    </h2>
                    <p className="text-sm text-slate-500">
                      {period} view across active accounts
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={exportPipeline}
                    className="rounded-lg bg-[#101828] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Export
                  </button>
                </div>

                <div className="mt-8 flex h-72 items-end gap-3 border-b border-l border-[#dfe5ee] px-2 pb-2">
                  {periodBars[period].map((height, index) => (
                    <div key={`${height}-${index}`} className="flex flex-1 items-end">
                      <div
                        className="w-full rounded-t-md bg-[#101828] transition-all"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-lg border border-[#dfe5ee] bg-[#101828] p-5 text-white shadow-sm">
                <h2 className="text-xl font-black">Account Health</h2>
                <p className="mt-1 text-sm text-slate-300">
                  {deals.length} active workspaces in pipeline
                </p>

                <div className="mt-7 grid place-items-center">
                  <div className="grid h-44 w-44 place-items-center rounded-full border-[16px] border-emerald-400 bg-white/5">
                    <div className="text-center">
                      <p className="text-4xl font-black">{healthScore}</p>
                      <p className="text-sm text-slate-300">Score</p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="rounded-lg bg-white/10 p-3">
                    <p className="font-bold">
                      {deals.filter((deal) => deal.stage === "Won").length}
                    </p>
                    <p className="text-slate-300">Won</p>
                  </div>
                  <div className="rounded-lg bg-white/10 p-3">
                    <p className="font-bold">
                      {deals.filter((deal) => deal.stage === "Negotiation").length}
                    </p>
                    <p className="text-slate-300">Hot</p>
                  </div>
                  <div className="rounded-lg bg-white/10 p-3">
                    <p className="font-bold">{deals.length}</p>
                    <p className="text-slate-300">Total</p>
                  </div>
                </div>
              </article>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
              <article className="rounded-lg border border-[#dfe5ee] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <h2 className="text-xl font-black text-[#101828]">
                    Sales Pipeline
                  </h2>
                  <select
                    value={stageFilter}
                    onChange={(e) =>
                      setStageFilter(e.target.value as DealStage | "All")
                    }
                    className="rounded-lg border border-[#d8dee8] bg-white px-3 py-2 text-sm font-semibold outline-none"
                  >
                    <option value="All">All stages</option>
                    {stages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>

                <form
                  onSubmit={handleAddDeal}
                  className="mt-5 grid gap-3 rounded-lg border border-[#dfe5ee] bg-[#f8fafc] p-3 md:grid-cols-[1fr_1fr_0.8fr_auto]"
                >
                  <input
                    value={newDeal.name}
                    onChange={(e) =>
                      setNewDeal((current) => ({
                        ...current,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Deal"
                    className="rounded-lg border border-[#d8dee8] bg-white px-3 py-2 text-sm outline-none"
                  />
                  <input
                    value={newDeal.company}
                    onChange={(e) =>
                      setNewDeal((current) => ({
                        ...current,
                        company: e.target.value,
                      }))
                    }
                    placeholder="Company"
                    className="rounded-lg border border-[#d8dee8] bg-white px-3 py-2 text-sm outline-none"
                  />
                  <input
                    value={newDeal.value}
                    onChange={(e) =>
                      setNewDeal((current) => ({
                        ...current,
                        value: e.target.value,
                      }))
                    }
                    placeholder="Value"
                    type="number"
                    min="1"
                    className="rounded-lg border border-[#d8dee8] bg-white px-3 py-2 text-sm outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Add deal"
                    className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500 text-white"
                  >
                    <PlusIcon />
                  </button>
                </form>

                <div className="mt-5 overflow-hidden rounded-lg border border-[#dfe5ee]">
                  {filteredDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="grid gap-3 border-b border-[#dfe5ee] p-4 last:border-b-0 md:grid-cols-[1fr_1fr_auto_auto] md:items-center"
                    >
                      <p className="font-bold text-[#101828]">{deal.name}</p>
                      <p className="text-sm text-slate-500">{deal.company}</p>
                      <p className="font-bold text-[#101828]">
                        {formatCurrency(deal.value)}
                      </p>
                      <select
                        value={deal.stage}
                        onChange={(e) =>
                          updateDealStage(deal.id, e.target.value as DealStage)
                        }
                        className="w-fit rounded-lg bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-800 outline-none"
                      >
                        {stages.map((stage) => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                  {filteredDeals.length === 0 ? (
                    <div className="p-5 text-sm font-semibold text-slate-500">
                      No matching deals
                    </div>
                  ) : null}
                </div>
              </article>

              <article className="rounded-lg border border-[#dfe5ee] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-[#101828]">
                    Live Activity
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      addActivity("Manual health check completed");
                      setUnread((current) => current + 1);
                    }}
                    className="rounded-lg border border-[#d8dee8] px-3 py-2 text-sm font-semibold"
                  >
                    Ping
                  </button>
                </div>
                <div className="mt-5 space-y-4">
                  {filteredActivities.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <span className="mt-1 h-3 w-3 rounded-full bg-sky-400" />
                      <div>
                        <p className="font-semibold text-[#101828]">
                          {activity.text}
                        </p>
                        <p className="text-sm text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                  {filteredActivities.length === 0 ? (
                    <p className="text-sm font-semibold text-slate-500">
                      No matching activity
                    </p>
                  ) : null}
                </div>
              </article>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
