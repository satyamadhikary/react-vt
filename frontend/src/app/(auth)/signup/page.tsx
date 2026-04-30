"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Headphones, Mic2, Music2, Sparkles, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type SignupRole = "listener" | "artist";

const roleDetails = {
  listener: {
    label: "Listener",
    eyebrow: "For listeners",
    title: "Find the sound that follows your day.",
    description:
      "Save favorites, follow new releases, and build a listening space shaped around the artists you love.",
    cta: "Create listener account",
    icon: Headphones,
    accent: "from-sky-500 via-cyan-400 to-emerald-400",
    glow: "bg-cyan-300/30",
    stats: ["Curated mixes", "Artist follows", "Personal library"],
  },
  artist: {
    label: "Artist",
    eyebrow: "For artists",
    title: "Put your catalog in motion.",
    description:
      "Create your profile, prepare releases, and connect every track with the listeners waiting for it.",
    cta: "Create artist account",
    icon: Mic2,
    accent: "from-rose-500 via-fuchsia-500 to-amber-300",
    glow: "bg-rose-300/30",
    stats: ["Release tools", "Audience reach", "Song management"],
  },
} satisfies Record<
  SignupRole,
  {
    label: string;
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    icon: typeof Headphones;
    accent: string;
    glow: string;
    stats: string[];
  }
>;

export default function Signup() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<SignupRole>("listener");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "listener" as SignupRole,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const activeDetails = roleDetails[activeRole];
  const ActiveIcon = activeDetails.icon;

  const selectRole = (role: SignupRole) => {
    setActiveRole(role);
    setForm((currentForm) => ({ ...currentForm, role }));
    setError("");
  };

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setIsLoading(false);

    if (!res.ok) {
      setError(data.error || "Could not create account");
      return;
    }

    router.push("/login");
  };

  return (
    <main className="h-dvh overflow-hidden bg-[#08090f] px-3 py-3 text-white sm:px-5 sm:py-4 lg:px-8">
      <div className="mx-auto flex h-full w-full max-w-6xl items-center">
        <section className="relative h-full max-h-[calc(100dvh-1.5rem)] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 sm:max-h-[calc(100dvh-2rem)] md:h-[min(660px,calc(100dvh-2rem))]">
          <div
            className={`pointer-events-none absolute -top-28 h-80 w-80 rounded-full blur-3xl transition-all duration-700 ${activeDetails.glow} ${
              activeRole === "listener" ? "-right-16" : "-left-16"
            }`}
          />

          <div
            className={`relative z-10 flex h-full w-full items-center overflow-hidden px-5 py-5 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-7 sm:py-6 md:absolute md:inset-y-0 md:left-0 md:w-1/2 md:px-10 ${
              activeRole === "artist" ? "md:translate-x-full" : ""
            }`}
          >
            <div className="mx-auto w-full max-w-md">
              <Link
                href="/"
                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white sm:mb-5"
              >
                <Music2 className="h-4 w-4" />
                Flute Music
              </Link>

              <div className="mb-4 inline-grid w-full grid-cols-2 rounded-full border border-white/10 bg-white/5 p-1 sm:mb-5">
                {(Object.keys(roleDetails) as SignupRole[]).map((role) => {
                  const RoleIcon = roleDetails[role].icon;
                  const isActive = activeRole === role;

                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => selectRole(role)}
                      className={`flex min-h-10 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold transition ${
                        isActive
                          ? "bg-white text-zinc-950 shadow-lg shadow-black/20"
                          : "text-white/65 hover:text-white"
                      }`}
                      aria-pressed={isActive}
                    >
                      <RoleIcon className="h-4 w-4" />
                      {roleDetails[role].label}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeRole}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="mb-4 sm:mb-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45 sm:text-sm">
                    {activeDetails.eyebrow}
                  </p>
                  <h1 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
                    Join as a {activeDetails.label.toLowerCase()}.
                  </h1>
                  <p className="mt-2 text-sm leading-5 text-white/58 sm:leading-6">
                    One account, tuned for the way you experience music.
                  </p>
                </motion.div>
              </AnimatePresence>

              <form onSubmit={handleSignup} className="space-y-3">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-white/70">
                    Full name
                  </span>
                  <input
                    type="text"
                    placeholder="Ariana Stone"
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 text-white outline-none transition placeholder:text-white/28 focus:border-white/35 focus:bg-white/[0.1] focus:ring-4 focus:ring-white/10"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-white/70">
                    Email
                  </span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(event) =>
                      setForm({ ...form, email: event.target.value })
                    }
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 text-white outline-none transition placeholder:text-white/28 focus:border-white/35 focus:bg-white/[0.1] focus:ring-4 focus:ring-white/10"
                    required
                  />
                </label>

                <label className="block pb-2">
                  <span className="mb-1.5 block text-sm font-medium text-white/70">
                    Password
                  </span>
                  <input
                    type="password"
                    placeholder="Create a secure password"
                    value={form.password}
                    onChange={(event) =>
                      setForm({ ...form, password: event.target.value })
                    }
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 text-white outline-none transition placeholder:text-white/28 focus:border-white/35 focus:bg-white/[0.1] focus:ring-4 focus:ring-white/10"
                    required
                  />
                </label>

                <input type="hidden" name="role" value={form.role} />

                {error ? (
                  <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${activeDetails.accent} px-4 font-semibold text-zinc-950 shadow-lg shadow-black/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100`}
                >
                  <Sparkles className="h-4 w-4" />
                  {isLoading ? "Creating..." : activeDetails.cta}
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-white/55">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-white underline-offset-4 hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>

          <aside
            className={`absolute inset-y-0 left-0 z-10 hidden w-1/2 overflow-hidden border-white/10 bg-white/[0.03] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:flex ${
              activeRole === "artist"
                ? "translate-x-0 border-r"
                : "translate-x-full border-l"
            }`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%)]" />
            <div
              className={`absolute inset-x-10 top-10 h-56 rounded-full bg-gradient-to-r ${activeDetails.accent} opacity-30 blur-3xl`}
            />

            <div className="relative flex w-full flex-col justify-between p-8 lg:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeRole}
                  initial={{ opacity: 0, x: activeRole === "artist" ? -24 : 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: activeRole === "artist" ? 24 : -24 }}
                  transition={{ duration: 0.34, ease: "easeOut" }}
                  className="flex h-full flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                      <ActiveIcon className="h-6 w-6" />
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-medium text-white/70">
                      {activeRole === "listener"
                        ? "Artist form tucked away"
                        : "Listener form tucked away"}
                    </div>
                  </div>

                  <div className="my-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/45 lg:text-sm">
                      {activeDetails.eyebrow}
                    </p>
                    <h2 className="mt-4 max-w-md text-4xl font-bold leading-[1.05] text-white lg:text-5xl">
                      {activeDetails.title}
                    </h2>
                    <p className="mt-4 max-w-md text-sm leading-6 text-white/62 lg:text-base">
                      {activeDetails.description}
                    </p>
                  </div>

                  <div className="grid gap-2.5">
                    {activeDetails.stats.map((stat, index) => (
                      <div
                        key={stat}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur lg:px-5"
                      >
                        <span className="flex items-center gap-3 text-sm font-medium text-white/72">
                          <Users className="h-4 w-4" />
                          {stat}
                        </span>
                        <span className="text-sm font-semibold text-white/40">
                          0{index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
