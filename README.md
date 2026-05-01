# Stock Portfolio Tracker — Frontend

> Version 1.0.0 · React 18 · TypeScript · Vite

Single-page application for the Stock Portfolio Tracker. Displays live market data, portfolio holdings, performance metrics, and wallet balance.

![screenshot](https://github.com/user-attachments/assets/204b91c9-7eeb-4e5a-8642-d92f55f3e623)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| UI components | shadcn/ui + lucide-react |
| Data fetching | SWR 2 |
| Routing | React Router v6 |
| API | Stock Portfolio Tracker Backend (Spring Boot) |

---

## Project Structure

```
src/
├── components/
│   ├── dashboard/      # PortfolioSummary, MarketOverview
│   ├── portfolio/      # PortfolioTable
│   ├── alerts/         # AlertList
│   └── ui/             # shadcn/ui primitives (Card, …)
├── hooks/
│   └── usePortfolio.ts # Shared SWR hook for portfolio data
├── lib/
│   └── api.ts          # HTTP layer (fetch wrappers)
├── pages/              # Portfolio, Alerts, Settings, Help
├── types/
│   ├── Stock.ts        # Portfolio stock holding type
│   ├── stock-data.ts   # Live market quote type (StockData)
│   └── Portfolio.ts    # Portfolio aggregate type
└── App.tsx             # Router + Sidebar + Dashboard
```

---

## Prerequisites

- Node.js 18+
- npm 9+
- Stock Portfolio Tracker Backend running on `http://localhost:8080`

---

## Getting Started

**1. Install dependencies**

```bash
npm install
```

**2. Start the development server**

```bash
npm run dev
```

The app is available at `http://localhost:5173`.

**3. Build for production**

```bash
npm run build
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard — portfolio summary cards + market overview |
| `/portfolio` | Holdings table + add stock modal |
| `/alerts` | Price alerts (UI only, backend pending) |
| `/settings` | App settings (UI only, backend pending) |
| `/help` | Help & documentation |

---

## Author

Developed by **Yassine Azzouz**
