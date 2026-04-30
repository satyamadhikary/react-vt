"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Headphones, LogIn, Music2, Radio, Sparkles, Users } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (res?.error) {
      setError(res.error);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <main className="h-dvh overflow-hidden bg-[#08090f] px-3 py-3 text-white sm:px-5 sm:py-4 lg:px-8">
      <div className="mx-auto flex h-full w-full max-w-6xl items-center">
        <section className="relative grid h-full max-h-[calc(100dvh-1.5rem)] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 sm:max-h-[calc(100dvh-2rem)] md:h-[min(660px,calc(100dvh-2rem))] md:grid-cols-2">
          <div className="pointer-events-none absolute -right-16 -top-28 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-rose-300/20 blur-3xl" />

          <div className="relative z-10 flex h-full items-center overflow-hidden px-5 py-5 sm:px-7 sm:py-6 md:px-10">
            <div className="mx-auto w-full max-w-md">
              <Link
                href="/"
                className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
              >
                <Music2 className="h-4 w-4" />
                Flute Music
              </Link>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
                className="mb-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45 sm:text-sm">
                  Welcome back
                </p>
                <h1 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
                  Login to your music space.
                </h1>
                <p className="mt-2 text-sm leading-5 text-white/58 sm:leading-6">
                  Continue listening, managing releases, and keeping your sound
                  in sync.
                </p>
              </motion.div>

              <form onSubmit={handleLogin} className="space-y-3">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-white/70">
                    Email
                  </span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 text-white outline-none transition placeholder:text-white/28 focus:border-white/35 focus:bg-white/[0.1] focus:ring-4 focus:ring-white/10"
                    required
                  />
                </label>

                {error ? (
                  <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 px-4 font-semibold text-zinc-950 shadow-lg shadow-black/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                >
                  <LogIn className="h-4 w-4" />
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-white/55">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-white underline-offset-4 hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>

          <aside className="relative z-10 hidden h-full overflow-hidden border-l border-white/10 bg-white/[0.03] md:flex">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%)]" />
            <div className="absolute inset-x-10 top-10 h-56 rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-amber-300 opacity-25 blur-3xl" />

            <div className="relative flex w-full flex-col justify-between p-8 lg:p-10">
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.36, ease: "easeOut" }}
                className="flex h-full flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                    <Headphones className="h-6 w-6" />
                  </div>
                  <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm font-medium text-white/70">
                    Your session is waiting
                  </div>
                </div>

                <div className="my-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/45 lg:text-sm">
                    Back to the stream
                  </p>
                  <h2 className="mt-4 max-w-md text-4xl font-bold leading-[1.05] text-white lg:text-5xl">
                    Pick up where the last track left off.
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-6 text-white/62 lg:text-base">
                    One login brings your listener library and artist tools
                    back into view.
                  </p>
                </div>

                <div className="grid gap-2.5">
                  {[
                    { label: "Saved playlists", icon: Radio },
                    { label: "Artist dashboard", icon: Sparkles },
                    { label: "Community follows", icon: Users },
                  ].map((item, index) => {
                    const ItemIcon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur lg:px-5"
                      >
                        <span className="flex items-center gap-3 text-sm font-medium text-white/72">
                          <ItemIcon className="h-4 w-4" />
                          {item.label}
                        </span>
                        <span className="text-sm font-semibold text-white/40">
                          0{index + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
