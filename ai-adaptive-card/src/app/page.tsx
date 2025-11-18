export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-white px-6 py-12 text-center text-slate-900">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
        AI Adaptive Card
      </p>
      <h1 className="text-4xl font-semibold tracking-tight">
        Minimal sandbox ready to build on.
      </h1>
      <p className="max-w-xl text-base text-slate-600">
        Start by shaping the adaptive card experience you have in mind. This
        blank slate keeps only the essentials—no demo content, extra assets, or
        marketing links—so we can focus purely on the core experience next.
      </p>
    </main>
  );
}
