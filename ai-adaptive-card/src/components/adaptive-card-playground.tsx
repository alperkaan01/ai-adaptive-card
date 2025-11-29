'use client';

/**
 * AdaptiveCardPlayground (Client Component):
 * Single-prompt interface that calls the FastAPI generator
 * and renders the returned adaptive card.
 */
import { useState, useRef, useEffect } from 'react';
import { CardNodeSchema, type CardNode } from '@/lib/card-schema';
import AdaptiveCard from './adaptive-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, Sparkles, User, Copy, Check, Terminal, Command } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content?: string;
  card?: CardNode;
};

const CONVERSATION_STARTERS = [
  {
    title: 'Financial Overview',
    prompt: 'Create a financial dashboard comparing Q1 and Q2 revenue with a bar chart and a summary table.',
    icon: '💰',
  },
  {
    title: 'Project Roadmap',
    prompt: 'Design a project roadmap for a mobile app launch with a timeline and key milestones.',
    icon: '🚀',
  },
  {
    title: 'User Analytics',
    prompt: 'Show user growth statistics for the last 6 months with a line chart and key metrics.',
    icon: '📈',
  },
  {
    title: 'Product Comparison',
    prompt: 'Compare three subscription plans (Basic, Pro, Enterprise) in a feature table.',
    icon: '⚖️',
  },
];

function CardSkeleton() {
  return (
    <div className="w-full rounded-xl border-none bg-card shadow-sm p-8 space-y-8 animate-pulse ring-1 ring-border/50">
      <div className="space-y-3">
        <Skeleton className="h-10 w-1/3 bg-muted" />
        <Skeleton className="h-5 w-1/2 bg-muted" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="h-48 w-full rounded-xl bg-muted" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-full bg-muted" />
          <Skeleton className="h-5 w-full bg-muted" />
          <Skeleton className="h-5 w-5/6 bg-muted" />
        </div>
      </div>
      <Skeleton className="h-40 w-full rounded-xl bg-muted" />
    </div>
  );
}

export function AdaptiveCardPlayground() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/generate-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const json = await response.json();
      const parsed = CardNodeSchema.safeParse(json);

      if (!parsed.success) {
        console.error(parsed.error);
        throw new Error('Received invalid card structure from API.');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        card: parsed.data as CardNode,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unexpected error occurred.';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(prompt);
  };

  const copyToClipboard = (card: CardNode, index: number) => {
    navigator.clipboard.writeText(JSON.stringify(card, null, 2));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto h-[calc(100vh-2rem)] relative overflow-hidden rounded-[2rem] border border-border/20 bg-card/40 backdrop-blur-2xl shadow-2xl ring-1 ring-black/5">

      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-border/10 bg-card/30 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Command className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-lg tracking-tight text-foreground">AI Adaptive Card</h1>
            <p className="text-xs text-muted-foreground font-medium">Interactive Component Generator</p>
          </div>
        </div>
        <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 px-3 py-1 rounded-full">
          v1.0.0 Beta
        </Badge>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4 md:p-8">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12 animate-in fade-in duration-700">
            <div className="space-y-6 max-w-2xl">
              <div className="inline-flex items-center justify-center p-6 rounded-[2rem] bg-card shadow-xl shadow-primary/5 mb-4 ring-1 ring-border/5">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h2 className="font-serif text-5xl md:text-7xl font-medium tracking-tight text-foreground drop-shadow-sm">
                Design at the <br /> speed of thought.
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto font-light">
                Describe any interface, and watch it come to life instantly as a fully interactive component.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl px-4">
              {CONVERSATION_STARTERS.map((starter, index) => (
                <button
                  key={index}
                  onClick={() => handleSubmit(starter.prompt)}
                  className="group flex items-start p-5 gap-4 rounded-2xl border border-transparent bg-card/60 hover:bg-card hover:border-primary/10 backdrop-blur-sm transition-all duration-300 text-left shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 ring-1 ring-border/5"
                >
                  <span className="text-3xl bg-muted p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">{starter.icon}</span>
                  <div className="space-y-1">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors block">
                      {starter.title}
                    </span>
                    <span className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-light">
                      {starter.prompt}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-10 pb-10 max-w-5xl mx-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex w-full gap-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <Avatar className="h-10 w-10 mt-1 border border-border shadow-md shrink-0 ring-2 ring-primary/10">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">AI</AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-4xl ${msg.role === 'user'
                    ? 'bg-primary text-primary-foreground px-6 py-4 rounded-[1.5rem] rounded-tr-sm shadow-xl shadow-primary/20'
                    : 'w-full'
                    }`}
                >
                  {msg.content && <p className="text-lg leading-relaxed whitespace-pre-wrap font-light">{msg.content}</p>}
                  {msg.card && (
                    <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700 mt-2">
                      <div className="absolute -right-14 top-0 opacity-0 group-hover:opacity-100 transition-opacity hidden xl:block">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(msg.card!, index)}
                          className="h-10 w-10 rounded-full bg-card shadow-md hover:bg-muted text-muted-foreground hover:text-primary transition-all"
                          title="Copy JSON"
                        >
                          {copiedIndex === index ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </Button>
                      </div>
                      <AdaptiveCard card={msg.card} />
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <Avatar className="h-10 w-10 mt-1 border border-border shadow-md shrink-0 ring-2 ring-black/5">
                    <AvatarFallback className="bg-muted text-foreground">
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex w-full gap-6 justify-start animate-in fade-in duration-500 max-w-5xl mx-auto">
                <Avatar className="h-10 w-10 mt-1 border border-border shadow-md shrink-0 ring-2 ring-primary/10">
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold">AI</AvatarFallback>
                </Avatar>
                <div className="w-full max-w-4xl">
                  <CardSkeleton />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-6 md:p-8 bg-gradient-to-t from-background/80 to-transparent backdrop-blur-sm z-20">
        <form
          onSubmit={onFormSubmit}
          className="relative mx-auto w-full max-w-4xl rounded-full border border-border/40 bg-card/80 backdrop-blur-xl p-2 shadow-2xl shadow-primary/10 transition-all focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/30 hover:shadow-primary/20 hover:bg-card"
        >
          <div className="flex items-center gap-4 pl-6 pr-2">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-transparent py-4 text-lg outline-none placeholder:text-muted-foreground/40 font-light"
              placeholder="Describe a card to generate..."
              autoFocus
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !prompt.trim()}
              className="rounded-full w-12 h-12 shrink-0 bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:shadow-none"
            >
              <ArrowUp className="w-6 h-6" />
            </Button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground/60 font-medium tracking-wide uppercase">
            Powered by AI • Designed for Humans
          </p>
        </div>
      </div>
    </div>
  );
}
