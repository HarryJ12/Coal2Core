<div align="center">

# Coal2Core - A Futuristic View on Saving our Planet

**Ranking retired U.S. coal plant sites for Small Modular Reactor conversion using machine learning**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black.svg)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
[![Mapbox](https://img.shields.io/badge/Mapbox-GL%20JS-teal.svg)](https://www.mapbox.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8.svg)](https://tailwindcss.com/)

</div>

---

## The Problem

Global warming is accelerating. Coal plants across the U.S. are retiring. At the same time, AI-driven electricity demand is exploding, and we're still heavily reliant on fossil fuels.

The U.S. Department of Energy has found that ~80% of screened coal sites are physically suitable for advanced nuclear. Massachusetts Governor Maura Healey recently launched an initiative to build 10 GW of new energy resources, including nuclear power. The opportunity is right in front of us.

**Coal2Core** is a data-driven platform that scores 374 U.S. coal plant sites for Small Modular Reactor (SMR) conversion viability, combining symbolic regression, SVR machine learning, Monte Carlo stress-testing, and financial modeling into an interactive map.

---

## What It Does

- **ML scoring:** Evaluates every coal site on grid infrastructure, cooling water access, terrain, population buffer, seismic risk, and state regulatory policy
- **Interactive map:** Visualizes all 374 plants with color-coded suitability tiers on a dark Mapbox GL canvas
- **Financial modeling:** Calculates CapEx, LCOE, and 40-year NPV per site across three scenarios (Optimistic / Base / Pessimistic)
- **Monte Carlo robustness:** 1,000-iteration simulation validates top sites under operational and economic uncertainty
- **Environmental impact:** Estimates annual CO₂ reduction and potential AI data center capacity per plant

---

## The Model

We used **PySR (symbolic regression)** to derive an interpretable scoring equation from DOE/OR-SAGE rubric criteria, then trained a **Support Vector Regression (SVR)** model that outperformed ElasticNet, BayesianRidge, and PolynomialLasso in 5-fold nested cross-validation.

**R² = 0.965**

The model evaluates 10 continuous features including capacity, distance to water, distance to transmission infrastructure, population density, seismic risk, and floodplain risk — with median imputation for missing values across 374 validated coal plants.

Ground truth scores weight:

| Factor | Weight |
|--------|--------|
| Population proximity | 45% |
| Dedicated cooling infrastructure | 20% |
| Nameplate capacity | 15% |
| Light Water Reactor heritage | 15% |
| High-voltage grid (≥230 kV) | 5% |
| Ash impoundment penalty | -10% |

---

## Tech Stack

### Frontend
- **Next.js 16** + React 19 (App Router, Turbopack)
- **Mapbox GL JS 3** - interactive plant map
- **Tailwind CSS 4** - dark-theme UI
- **KaTeX** - formula rendering on methodology pages
- **TypeScript** - end-to-end type safety

### ML & Data Pipeline
- **Python** - pandas, scikit-learn, numpy
- **PySR** - symbolic regression (Julia backend)
- **SVR (RBF kernel)** - final predictive model
- **Monte Carlo simulation** - 1,000-iteration robustness testing
- **Jupyter Notebooks** - exploratory analysis and pipeline documentation

---

## Project Structure

```
Coal2Core/
├── src/
│   ├── app/                  # Next.js pages (dashboard, methodology, importance, fears)
│   ├── components/           # MapComponent, Sidebar, InfoPanel, Navbar, Dashboard
│   └── lib/                  # coalPlantData.ts (374 plants), types.ts
├── ml_and_data_pipeline/
│   ├── training_pipeline.ipynb            # SVR training, cross-validation, Monte Carlo, financials
│   ├── testing_pipeline.ipynb             # Feature engineering, PySR symbolic regression
│   ├── coal_to_smr_final.csv              # Final scored dataset (374 plants)
│   └── monte_carlo_top20_robust_sites.csv # Monte Carlo output: top 10 robust coal-to-SMR candidates
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Mapbox](https://www.mapbox.com/) account (free tier works)

### Setup

```bash
git clone https://github.com/HarryJ12/Coal2Core.git
cd Coal2Core
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Running the ML Pipeline

Open the notebooks in order:

1. `ml_and_data_pipeline/testing_pipeline.ipynb` — feature engineering & symbolic regression
2. `ml_and_data_pipeline/training_pipeline.ipynb` — SVR training, validation, Monte Carlo, financial output

Requires: `pandas`, `scikit-learn`, `numpy`, `pysr`, `matplotlib`

---

## Key Results

- **374** U.S. coal plant sites scored
- **Top 20** Monte Carlo-validated sites identified as robust under uncertainty
- **R² = 0.965** on held-out validation set
- Sites can individually reduce **1M–19M tons CO₂/year** when converted
- Each site can support **5–16 AI data center campuses** (at 150 MW/campus)

---

## Built at the Tufts Data Science Club — NSDC Datathon 2026
