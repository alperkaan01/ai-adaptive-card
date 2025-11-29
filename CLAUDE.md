# Project: AI Adaptive Card

## Overview
A minimal workspace for building an AI-editable adaptive card system. The backend generates valid JSON card structures via LLM (OpenAI), and the frontend renders them as interactive UI components.

## Tech Stack
- **Frontend**: Next.js 16+, React 19, Tailwind CSS 4, Shadcn UI, TypeScript.
- **Backend**: Python 3.11+, FastAPI, Pydantic, OpenAI API.
- **Package Manager**: `npm` (frontend), `pixi` (backend environment).

## Project Structure
```
.
├── ai-adaptive-card/       # Frontend (Next.js)
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   ├── components/     # React components
│   │   └── lib/            # Utilities
│   ├── public/             # Static assets
│   └── package.json
├── llm/                    # Backend (Python)
│   ├── main.py             # FastAPI entrypoint
│   ├── models.py           # Pydantic models
│   ├── llm_client.py       # OpenAI integration
│   └── pixi.toml           # Python dependencies
├── CLAUDE.md               # Project documentation
└── README.md
```

## Coding Rules

### General
- **Sequential Thinking**: Use sequential thinking (MCP tool) ONLY for complex tasks requiring significant code changes, major refactoring, or architectural decisions. For simple tasks, skip sequential thinking for speed.
- **Formatting**: Use standard formatters (Prettier for JS/TS, Black/Isort for Python).
- **Paths**: Use absolute imports where possible in frontend (`@/components/...`).
- **Documentation**: ALWAYS update this CLAUDE.md file whenever a new major feature is introduced or significant architectural changes are made. Keep the "Current State" section up to date.
- **Git Commits**: When a new feature is integrated, create a commit with a concise one-line commit message describing the feature.

### Frontend (Next.js)
- **Components**: Functional components with TypeScript interfaces.
- **Styling**: Tailwind CSS for styling. Avoid inline styles.
- **State**: Use React hooks (`useState`, `useEffect`) appropriately.
- **Icons**: Use `lucide-react`.
- **Strictness**: No `any` types unless absolutely necessary.

### Backend (Python)
- **Typing**: Enforce strict type hints. Use `from __future__ import annotations`.
- **Validation**: Use Pydantic models for all data structures.
- **API**: FastAPI for endpoints. Follow RESTful conventions.
- **LLM**: Ensure strict JSON output from LLM using system prompts and validation.

## Current State
- **Backend**: `POST /generate-card` endpoint works, returning a validated `CardNode` tree.
- **Frontend**:
  - `AdaptiveCard` component renders the JSON tree with full visual styling.
  - `AdaptiveCardPlayground` provides a chat-like interface with conversation starters.
  - Support for nested card nodes and complex layouts.
  - Chart series color customization implemented.
  - Shadcn UI components integrated (Button, Skeleton, Avatar, ScrollArea, Badge, Tabs, Separator, etc.).
- **Models**: Basic nodes supported (Title, Subtitle, Text, Bullets, Table, Chart, ResizableLayout).
- **Schemas**: TypeScript Zod schemas for type validation on the frontend.
