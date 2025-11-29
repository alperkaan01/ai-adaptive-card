import { AdaptiveCardPlayground } from '@/components/adaptive-card-playground';

export default function Home() {
  return (
    <main className="bg-background text-foreground flex min-h-screen flex-col items-center px-4 py-10">
      <AdaptiveCardPlayground />
    </main>
  );
}
