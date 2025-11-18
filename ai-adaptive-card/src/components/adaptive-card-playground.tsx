'use client';

/**
 * AdaptiveCardPlayground (Client Component):
 * Single-prompt interface that calls the FastAPI generator
 * and renders the returned adaptive card.
 */
import { useState, type FormEvent, type ReactElement } from 'react';

import AdaptiveCard from '@/components/adaptive-card';
import { Button } from '@/components/ui/button';
import { CardNode, CardNodeSchema } from '@/lib/card-schema';

const API_URL = 'http://localhost:8000/generate-card';

export default function AdaptiveCardPlayground(): ReactElement {
  const [prompt, setPrompt] = useState<string>(
    'Summarize a 3-year financial projection with a table and a comparison chart.',
  );
  const [card, setCard] = useState<CardNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: prompt }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const json = await response.json();
      const parsed = CardNodeSchema.safeParse(json);

      if (!parsed.success) {
        console.error(parsed.error);
        throw new Error('Received invalid card structure from API.');
      }

      setCard(parsed.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unexpected error occurred.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex w-full max-w-5xl flex-col gap-6">
      <form
        onSubmit={onSubmit}
        className="rounded-xl border bg-background p-4 shadow-sm"
      >
        <div className="flex flex-col gap-3">
          <label
            htmlFor="adaptive-card-prompt"
            className="text-sm font-medium text-foreground"
          >
            Describe the card you want to generate
          </label>
          <textarea
            id="adaptive-card-prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={4}
            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full resize-none rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
            placeholder="Example: Compare this quarter’s revenue and expenses, with a table and a line chart."
          />
          <div className="flex items-center justify-between gap-3 pt-1">
            <p className="text-xs text-muted-foreground">
              The AI will return a single adaptive card JSON tree; the UI will
              render it with a constrained set of components.
            </p>
            <Button type="submit" size="sm" disabled={isLoading}>
              {isLoading ? 'Generating…' : 'Generate card'}
            </Button>
          </div>
        </div>
      </form>

      {error && (
        <div className="border-destructive/60 bg-destructive/5 text-destructive rounded-lg border px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {card && (
        <div className="flex justify-center">
          <AdaptiveCard card={card} />
        </div>
      )}
    </section>
  );
}

