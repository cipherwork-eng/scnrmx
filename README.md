<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/AI_Agent-MiMo_Pro-8B5CF6?style=for-the-badge&logo=google&logoColor=white" alt="AI Agent">
</p>

<br />

<div align="center">

# ScnrMx

### On-Chain Intelligence, Reimagined

**AI-powered blockchain analytics platform that lets you ask the chain anything.**

Natural language queries. Real-time whale tracking. Smart money analysis. Token safety scoring. Airdrop eligibility detection. All powered by an advanced reasoning AI agent.

<br />

[Live Demo](https://scnrmx.vercel.app) · [Documentation](#-api-reference) · [Report Bug](https://github.com/cipherwork-eng/scnrmx/issues) · [Request Feature](https://github.com/cipherwork-eng/scnrmx/issues)

</div>

<br />

---

## Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [AI Agent System](#-ai-agent-system)
- [Design System](#-design-system)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

<br />

---

## Overview

**ScnrMx** is a next-generation on-chain intelligence platform that combines the power of large language models with real-time blockchain data. Instead of navigating complex explorers, dashboards, and analytics tools separately, users simply ask questions in natural language and receive comprehensive, actionable insights.

The platform's AI agent understands blockchain context — it can interpret whale movements, detect suspicious token contracts, evaluate airdrop eligibility, and assess portfolio risk, all through conversational interaction.

### Why ScnrMx?

The blockchain data landscape is fragmented. Traders and researchers juggle between DEXScreener, Etherscan, DeBank, Arkham, Nansen, and dozens of other tools. Each provides a piece of the puzzle, but none provides the full picture through a single, intelligent interface.

ScnrMx solves this by:

- **Unifying data sources** — on-chain data, market data, social signals, and contract analysis converge in one platform
- **Adding intelligence** — a reasoning AI agent that doesn't just fetch data, but interprets it, finds patterns, and provides recommendations
- **Reducing friction** — natural language queries replace the need to learn multiple specialized tools
- **Democratizing alpha** — institutional-grade intelligence accessible to retail users

<br />

---

## Key Features

### AI Agent Chat

Conversational interface powered by an advanced reasoning model. Ask complex blockchain questions in plain English and receive structured, data-backed responses.

```
> "What tokens did the top 5 ETH whales accumulate this week?"
> "Is this contract safe? 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
> "Check if my wallet is eligible for the EigenLayer airdrop"
> "Compare gas fees on Ethereum vs Base vs Arbitrum right now"
```

**Capabilities:**
- Natural language to structured on-chain queries
- Multi-chain data aggregation (Ethereum, Solana, Base, Arbitrum, Polygon)
- Contextual follow-ups — the agent remembers the conversation
- Reasoning transparency — see the agent's thought process in real-time
- Code generation — the agent can write custom on-chain queries

### Dashboard

Real-time market overview with:
- Total crypto market cap and 24h change
- BTC/ETH dominance metrics
- Fear & Greed Index with historical trend
- Top gainers and losers across all tracked chains
- DEX volume aggregations
- Active address metrics
- Gas price tracking (low/average/fast)

### Whale Tracker

Monitor smart money movements:
- Real-time whale transaction feed
- Wallet clustering — detect coordinated movements
- Accumulation/distribution pattern recognition
- Historical whale behavior profiles
- Custom whale watchlists with alerts
- Net flow analysis per token

### Token Explorer

Deep token analysis engine:
- **Safety Score** (0-100) — contract verification, holder distribution, liquidity lock status, ownership renouncement, proxy detection
- Holder analytics — top holders, concentration ratio, whale holdings
- Liquidity analysis — pool depth, DEX availability, volume/liquidity ratio
- Social sentiment score
- Historical price and volume data
- Contract audit status
- Honeypot detection

### Portfolio Intelligence

Connect a wallet for comprehensive analysis:
- Real-time portfolio valuation across all chains
- Asset allocation breakdown with risk assessment
- Impermanent loss calculator for LP positions
- Historical P&L tracking
- AI-generated rebalancing suggestions
- Gas-efficient swap recommendations
- Yield opportunity detection

### Alert System

Customizable alert engine:
- Whale movement alerts (configurable threshold)
- Price alert conditions (above/below/cross)
- Token safety score changes
- New token deployment alerts for tracked wallets
- Airdrop eligibility notifications
- Alert history and delivery status

### Airdrop Scanner

Proactive airdrop intelligence:
- Multi-protocol eligibility checker
- Farming progress tracker
- Gas cost vs estimated reward analysis
- Step-by-step claiming guides
- Deadline tracking
- Historical airdrop performance data

<br />

---

## Architecture

```
                          +-----------------------+
                          |     User Interface    |
                          |  (Next.js 16 + React) |
                          +-----------+-----------+
                                      |
                          +-----------v-----------+
                          |     API Gateway        |
                          |  (Next.js API Routes)  |
                          +-----------+-----------+
                                      |
                    +-----------------+-----------------+
                    |                                   |
          +---------v---------+             +-----------v-----------+
          |    AI Agent Core   |             |    Data Aggregation   |
          |  (MiMo v2.5 Pro)  |             |       Layer           |
          |                   |             |                       |
          |  - Intent parsing |             |  - Etherscan API      |
          |  - Query planning |             |  - Solscan API        |
          |  - Response gen   |             |  - CoinGecko API      |
          |  - Reasoning      |             |  - DEX Screener API   |
          +-------------------+             |  - DeFi Llama         |
                                            |  - The Graph          |
                                            +-----------+-----------+
                                                        |
                                            +-----------v-----------+
                                            |    PostgreSQL DB       |
                                            |  (User data, alerts,  |
                                            |   watchlists, cache)  |
                                            +-----------------------+
```

**Request Flow:**

1. User enters a natural language query or interacts with a dashboard
2. The AI agent parses the intent and generates a structured execution plan
3. The data aggregation layer fetches relevant on-chain and market data
4. The AI agent processes raw data, applies analytical reasoning, and generates insights
5. Results are streamed back to the user with reasoning transparency

<br />

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | Full-stack React framework with server components |
| **UI Library** | React 19 | Component architecture with concurrent features |
| **Language** | TypeScript 5 | Type-safe development |
| **Styling** | Tailwind CSS v4 | Utility-first CSS with custom design tokens |
| **Icons** | Lucide React | Consistent, lightweight icon system |
| **Charts** | Recharts | Declarative charting library for React |
| **AI Model** | MiMo v2.5 Pro | Advanced reasoning LLM for on-chain analysis |
| **Database** | PostgreSQL | Persistent storage for user data and caching |
| **Deployment** | Vercel | Edge-optimized hosting with serverless functions |
| **Design** | Linear-inspired dark UI | Premium, restrained aesthetic (#09090b base) |

<br />

---

## Getting Started

### Prerequisites

- **Node.js** 20.x or later
- **npm** 10.x or later
- **MiMo API Key** — obtain from [MiMo Open Platform](https://platform.xiaomimimo.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/cipherwork-eng/scnrmx.git
cd scnrmx

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your actual keys

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
npm run start
```

<br />

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# AI Agent — MiMo v2.5 Pro
MIMO_API_KEY=your-mimo-api-key
MIMO_API_BASE=https://api.xiaomimimo.com/v1
MIMO_MODEL=mimo-v2.5-pro

# Blockchain Data APIs (optional — for enhanced features)
ETHERSCAN_API_KEY=your-etherscan-key
SOLSCAN_API_KEY=your-solscan-key
COINGECKO_API_KEY=your-coingecko-key
```

See `.env.example` for the complete list.

> **Note:** The AI agent works with just the MiMo API key. Blockchain data APIs enhance the experience with real-time on-chain data but are not required for the core conversational interface.

<br />

---

## Project Structure

```
scnrmx/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── agent/
│   │   │       └── route.ts        # AI Agent SSE endpoint
│   │   ├── chat/
│   │   │   └── page.tsx            # Conversational AI interface
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Market overview dashboard
│   │   ├── whales/
│   │   │   └── page.tsx            # Whale tracker
│   │   ├── tokens/
│   │   │   └── page.tsx            # Token explorer + safety
│   │   ├── portfolio/
│   │   │   └── page.tsx            # Portfolio analysis
│   │   ├── alerts/
│   │   │   └── page.tsx            # Alert management
│   │   ├── airdrops/
│   │   │   └── page.tsx            # Airdrop scanner
│   │   ├── layout.tsx              # Root layout with sidebar
│   │   ├── page.tsx                # Landing / home page
│   │   └── globals.css             # Design tokens + base styles
│   ├── components/
│   │   ├── sidebar.tsx             # Navigation sidebar
│   │   ├── page-header.tsx         # Reusable page header
│   │   ├── stat-card.tsx           # Metric display card
│   │   ├── data-table.tsx          # Reusable data table
│   │   ├── chart-wrapper.tsx       # Chart container with loading
│   │   ├── safety-badge.tsx        # Token safety indicator
│   │   ├── whale-row.tsx           # Whale transaction row
│   │   └── alert-card.tsx          # Alert item card
│   ├── lib/
│   │   ├── mimo-client.ts          # Streaming AI API client
│   │   ├── agent-prompts.ts        # System prompts per context
│   │   └── format.ts               # Number/address formatting
│   └── hooks/
│       └── use-chat.ts             # Chat state management
├── public/
│   └── scnrmx-logo.svg             # Brand logo
├── .env.example                     # Environment template
├── next.config.ts                   # Next.js configuration
├── tailwind.config.ts               # Tailwind configuration (v4)
└── package.json
```

<br />

---

## API Reference

### `POST /api/agent`

Streaming AI agent endpoint. Accepts a conversation and returns a streamed response with reasoning.

**Request:**

```json
{
  "messages": [
    { "role": "user", "content": "What is the safety score of UNI token?" }
  ],
  "context": "tokens"
}
```

**Response (SSE):**

```
event: thinking
data: {"text": "Let me analyze the UNI token contract..."}

event: content
data: {"text": "UNI Token Safety Analysis:\n\n**Score: 92/100**..."}

event: done
data: {}
```

**Context values:** `general` | `whales` | `tokens` | `portfolio` | `alerts` | `airdrops`

<br />

---

## AI Agent System

ScnrMx's AI agent is not a simple chatbot wrapper — it's a structured reasoning engine designed specifically for on-chain intelligence.

### How It Works

1. **Intent Classification** — The agent classifies the user's query into one of several analytical domains (whale tracking, token safety, portfolio analysis, etc.)

2. **Execution Planning** — Based on the intent, the agent generates a structured plan of what data to fetch and how to analyze it

3. **Data Retrieval** — The plan is executed against on-chain APIs and market data providers

4. **Reasoning** — The agent applies domain-specific analysis to the raw data, identifying patterns, risks, and opportunities

5. **Response Generation** — Results are formatted into a clear, actionable response with supporting data and confidence levels

### Reasoning Transparency

Unlike black-box AI systems, ScnrMx exposes the agent's reasoning process in real-time. Users can observe how the agent arrives at its conclusions, building trust and enabling verification.

### System Prompts

Each analytical domain has a specialized system prompt that encodes domain expertise:

- **Whale Analysis** — Token flow patterns, wallet clustering heuristics, accumulation/distribution signals
- **Token Safety** — Contract vulnerability patterns, rug pull indicators, holder distribution risk factors
- **Portfolio** — Risk assessment frameworks, rebalancing strategies, gas optimization techniques
- **Airdrops** — Eligibility criteria parsing, farming strategy optimization, ROI estimation

<br />

---

## Design System

ScnrMx uses a **Linear-inspired dark design system** with these characteristics:

| Element | Value | Purpose |
|---------|-------|---------|
| Background | `#09090b` | Near-black canvas |
| Surface | `#111113` | Card backgrounds |
| Elevated | `#1a1a1e` | Hover states, dropdowns |
| Border | `rgba(255,255,255,0.08)` | Subtle structure |
| Text Primary | `#f0f0f2` | Headings, key data |
| Text Secondary | `#a0a0a8` | Body, descriptions |
| Text Muted | `#606068` | Metadata, labels |
| Accent | `#06b6d4` (Cyan) | Primary interactive |
| Accent Hover | `#22d3ee` | Interactive hover |
| Success | `#10b981` | Positive indicators |
| Danger | `#ef4444` | Risk indicators |
| Font | Inter | All text |
| Font Mono | JetBrains Mono | Code, addresses |

**Design Principles:**

- **Restraint over decoration** — no glassmorphism, no gradients, no glow effects
- **Luminance stacking** — elevation through background brightness, not shadows
- **Generous spacing** — content breathes, nothing feels cramped
- **Data density without clutter** — information-rich but visually calm
- **Subtle borders** — semi-transparent white borders instead of solid dark lines

<br />

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Add environment variables
vercel env add MIMO_API_KEY production
vercel env add MIMO_API_BASE production
```

### Self-Hosted

```bash
# Build
npm run build

# Start production server
npm run start -- -p 3000
```

<br />

---

## Roadmap

### Phase 1 — Foundation (Current)
- [x] AI Agent chat interface with streaming
- [x] Dashboard with market overview
- [x] Whale tracker with transaction feed
- [x] Token explorer with safety scoring
- [x] Portfolio analysis
- [x] Alert system
- [x] Airdrop scanner

### Phase 2 — Enhanced Intelligence
- [ ] Multi-chain wallet connect (WalletConnect v2)
- [ ] Historical data charts with technical indicators
- [ ] Custom query builder for advanced users
- [ ] Portfolio backtesting engine
- [ ] Social sentiment integration (X/Twitter analysis)
- [ ] Telegram/Discord alert delivery

### Phase 3 — Platform
- [ ] User accounts and saved preferences
- [ ] API access for developers
- [ ] Plugin system for custom data sources
- [ ] Mobile app (Capacitor)
- [ ] Community features (shared watchlists, signals)
- [ ] Pro tier with advanced analytics

<br />

---

## Contributing

Contributions are welcome. Please read the [contributing guidelines](CONTRIBUTING.md) before submitting a PR.

```bash
# Fork and clone
git clone https://github.com/your-username/scnrmx.git

# Create a feature branch
git checkout -b feature/your-feature

# Make changes, commit, push
git commit -m "feat: add your feature"
git push origin feature/your-feature

# Open a Pull Request
```

<br />

---

## License

MIT License. See [LICENSE](LICENSE) for details.

<br />

---

<div align="center">

**Built with precision. Powered by intelligence.**

<br />

<img src="https://img.shields.io/badge/Built_by-CipherWork-8B5CF6?style=for-the-badge" alt="CipherWork">
<img src="https://img.shields.io/badge/AI_Engine-MiMo_v2.5_Pro-06B6D4?style=for-the-badge" alt="MiMo">
<img src="https://img.shields.io/badge/Chain-Ethereum_%7C_Solana_%7C_Base-10B981?style=for-the-badge" alt="Multi-chain">

</div>
