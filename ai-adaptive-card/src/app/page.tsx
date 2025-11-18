import AdaptiveCardPlayground from '@/components/adaptive-card-playground';

export default function Home() {
  return (
    <main className="bg-background text-foreground flex min-h-screen flex-col items-center px-4 py-10">
      <div className="flex w-full max-w-5xl flex-col gap-3 pb-6 text-left">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
          AI Adaptive Card
        </p>
        <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Describe a card. Let the AI design the layout.
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Enter a prompt describing the content and structure you want—tables,
          charts, nested cards, and resizable layouts. The backend returns a
          constrained JSON tree, and this page renders it using only approved
          components.
        </p>
      </div>

      <AdaptiveCardPlayground />
    </main>
  );
}
