
type TableData = {
  headers: string[];
  rows: { cells: string[]; highlight?: boolean }[];
};

type Card = {
  category: string;
  heading: string;
  answer: string[];
  formula?: string;
  table?: TableData;
  stat?: { value: string; label: string };
};

const philosophyCards: Card[] = [
  {
    category: "THE PROBLEM",
    heading: "Why This Exists",
    answer: [
      "The planet is already past comfortable margins. Global temperatures are rising, extreme weather is intensifying, and ecosystems are degrading at a pace that makes every new fossil fuel dependency a compounding liability. The electricity grid is one of the largest levers we have, and right now, it is still heavily tied to carbon. Into that already-strained backdrop comes a new and accelerating demand: AI. Data center load is growing faster than clean firm supply can keep up with, and when that gap goes unmet by zero-carbon generation, it defaults to gas. Coal2Core exists at that intersection: the urgency of the climate crisis and the specific, solvable problem of where the next gigawatt of clean, reliable power comes from.",
    ],
    stat: { value: "~100 TWh/yr", label: "Residual clean gap between projected AI demand (~750 TWh/yr) and clean firm supply (~650 TWh/yr) by 2035" },
  },
  {
    category: "TRAINING THE MODEL",
    heading: "Model Selection & Performance",
    answer: [
      "The model was trained exclusively on 155 verified coal plant records curated from the full operating fleet, no synthetic data or unverifiable plants were added. National projections were then applied across 374 coal plants in total.",
      "Four model families were rigorously benchmarked using five-fold nested cross-validation, with the inner loop handling hyperparameter selection and the outer loop producing unbiased out-of-fold evaluations.",
      "SVR with an RBF kernel was selected as the final model for its superior balance of predictive accuracy and ranking stability. This strong, stable performance confirms that the model reliably learns meaningful, non-linear relationships from the verified data. The lower scores of the alternative models demonstrate that simpler linear or polynomial approaches cannot adequately capture the complex interactions in coal-to-nuclear site suitability.",
    ],
    table: {
      headers: ["Model", "OOF R²", "Stability", "Notes"],
      rows: [
        {
          cells: ["SVR (RBF kernel): Selected", "0.9652", "Very high (std dev = 0.021)", "Best fit and most consistent rankings"],
          highlight: true,
        },
        {
          cells: ["ElasticNet", "~0.86", "High", "Noticeably lower accuracy; linear assumptions insufficient for this siting problem"],
        },
        {
          cells: ["BayesianRidge", "~0.86", "High", "Similar to ElasticNet; failed to capture non-linear patterns effectively"],
        },
        {
          cells: ["Polynomial Lasso (degree 2)", "~0.68", "Very low", "Unstable rankings across folds; rejected due to high variability"],
        },
      ],
    },
  },
  {
    category: "TESTING THE MODEL",
    heading: "Scoring Coal Plants for Nuclear Suitability",
    answer: [
      "We divided the U.S. coal power plant dataset into a training set (with suitability labels) and a test set (with only raw data). The goal was to assign fair, realistic, and explainable suitability scores to the test set for nuclear conversion potential.",
      "The scoring approach is based entirely on the U.S. Department of Energy's Coal-to-Nuclear Transition Report (2022), which emphasizes key viability factors: strong grid infrastructure, reliable cooling water access, rural space and safety buffers, and manageable environmental conditions. These were translated into four features: Capacity (capacity_normalized + large_capacity_bonus), Location (rural_score), Cooling (dedicated_cooling), and Environment (unlined_ash_penalty).",
      "The 0.45 baseline provides a solid foundation for every qualifying plant. The capacity term (0.17 weight) rewards larger plants with better grid connections, including a bonus for sites at or above 800 MWe. The combined location, cooling, and environment term (0.13 weight) favors rural sites with dedicated cooling while applying penalties for issues like unlined ash ponds.",
      "In practice, raw plant data is used to compute the four features, the formula is applied, and the resulting score (0 to 1) is appended to each test plant's record. Higher scores indicate stronger candidates for nuclear conversion. The process is fully transparent, reproducible, and aligned with DOE engineering and policy criteria.",
    ],
    formula: "score = 0.45 + 0.17 × Capacity + 0.13 × (Location + Cooling + Environment)",
  },
  {
    category: "ROBUSTNESS",
    heading: "Monte Carlo Stress Testing",
    answer: [
      "A single deterministic rank is not enough. Coal2Core runs 1,000 perturbation simulations to test whether a site remains strong when inputs move within realistic bounds. Continuous features including capacity, water distance, transmission distance, population density, retirement year, and hazard metrics are independently perturbed with Gaussian noise scaled to the empirical standard deviation, then clipped to observed data bounds so the simulation does not generate physically implausible plants.",
      "The primary robustness signal is top-decile probability: the share of simulations in which the site lands in the top 10%. A site that stays near the top under uncertainty is more valuable than one that spikes in a single clean run. Sites with a strong deterministic rank but weak top-decile frequency are treated as brittle and are not rewarded.",
    ],
    stat: { value: "1,000", label: "Perturbation simulations per site; ranking persistence under uncertainty is the objective, not just accuracy on paper" },
  },
  {
    category: "ECONOMICS",
    heading: "Financial Impact",
    answer: [
      "Economics are evaluated with one standardized SMR model over a 40-year horizon so site rankings are not distorted by custom assumptions. Fixed inputs: $6,000/kW overnight CapEx, $120/kW-year fixed O&M, $9/MWh variable O&M, 7% discount rate, 93% capacity factor, $90/MWh electricity price.",
      "Three CapEx scenarios are tested: optimistic (0.8×), base case (1.0×), and pessimistic (1.3×). The top candidates remain attractive in the base case, while the pessimistic scenario identifies which sites are financially resilient rather than merely best-case winners.",
    ],
    stat: { value: "$6,000/kW", label: "Overnight CapEx baseline for a standardized 40-year NPV at 7% discount rate and 93% capacity factor" },
  },
  {
    category: "CLIMATE IMPACT",
    heading: "Carbon & Energy Impact",
    answer: [
      "Avoided emissions are estimated by replacing coal generation with near-zero operational SMR output at a 93% capacity factor: CO₂ avoided = Capacity (MW) × 8,760 h × 0.93 × 1.0 ton/MWh.",
      "The top 50 ranked sites represent approximately 83 GW of capacity, translating to roughly 671 TWh per year of annual clean generation, far exceeding the ~100 TWh/yr AI clean gap. Even a targeted subset of high-ranking coal sites could materially reduce the carbon cost of AI expansion while adding firm, dispatchable grid capacity.",
    ],
    stat: { value: "~83 GW", label: "Combined capacity of the top 50 ranked sites: ~671 TWh/yr of clean generation, closing the AI gap several times over" },
  },
];

export default function MethodologiesPage() {
  return (
    <div className="h-full overflow-y-auto bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-8 py-16">

        {/* Header */}
        <header className="mb-16">
          <h1 className="text-4xl font-bold tracking-widest uppercase text-white mb-4 text-center">
            Our Philosophy
          </h1>
        </header>

        {/* Cards */}
        <div className="space-y-3">
          {philosophyCards.map((card) => (
            <article
              key={card.heading}
              className="px-6 py-6 bg-[#1a1a1a] border border-[#222222] rounded-sm"
            >
              <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-emerald-400 mb-3">
                {card.category}
              </p>
              <h2 className="text-[16px] font-semibold text-white mb-4 max-w-3xl">
                {card.heading}
              </h2>
              <div className="space-y-3">
                {card.answer.slice(0, 2).map((paragraph, i) => (
                  <p key={i} className="text-[13px] text-zinc-400 leading-relaxed max-w-4xl">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Model comparison table */}
              {card.table && (
                <div className="mt-4 w-full overflow-x-auto bg-[#141414] border border-[#222222] px-4 py-3">
                  <table className="w-full text-[11px] font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-[#2a2a2a]">
                        {card.table.headers.map((h) => (
                          <th key={h} className="pb-2 pr-5 text-left text-zinc-500 tracking-[0.12em] uppercase font-normal">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {card.table.rows.map((row, i) => (
                        <tr
                          key={i}
                          className={`border-b border-[#1e1e1e] ${row.highlight ? "bg-emerald-950/20" : ""}`}
                        >
                          {row.cells.map((cell, j) => (
                            <td
                              key={j}
                              className={`py-2 pr-5 leading-relaxed align-top ${
                                j === 0
                                  ? row.highlight ? "text-emerald-400 font-semibold" : "text-zinc-300"
                                  : j === 1
                                  ? row.highlight ? "text-emerald-400 font-bold" : "text-zinc-400"
                                  : "text-zinc-500"
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Formula box */}
              {card.formula && (
                <div className="mt-5 inline-block px-4 py-3 bg-[#141414] border border-[#222222]">
                  <span className="font-mono text-[13px] text-zinc-300 leading-relaxed">
                    {card.formula}
                  </span>
                </div>
              )}

              {card.answer.length > 2 && (
                <div className="space-y-3 mt-3">
                  {card.answer.slice(2).map((paragraph, i) => (
                    <p key={i} className="text-[13px] text-zinc-400 leading-relaxed max-w-4xl">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {card.stat && (
                <div className="mt-5 inline-flex flex-col px-4 py-3 bg-[#141414] border border-[#222222] min-w-[210px]">
                  <span className="text-2xl font-bold text-white leading-tight">
                    {card.stat.value}
                  </span>
                  <span className="text-[11px] text-zinc-600 mt-1 leading-relaxed">
                    {card.stat.label}
                  </span>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Footer */}
        <footer className="pt-6 pb-10 text-[11px] text-zinc-600 leading-relaxed space-y-2">
          <div>
            Data sources:{" "}
            <a href="https://www.eia.gov/electricity/data/eia860/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 underline underline-offset-2">EIA-860 Form Data</a>
            {" · "}
            <a href="https://info.ornl.gov/sites/publications/Files/Pub164448.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 underline underline-offset-2">ORNL SMR Siting Criteria</a>
            {" · "}
            <a href="https://sai.inl.gov/content/uploads/29/2024/11/c2n2022report.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 underline underline-offset-2">INL Coal-to-Nuclear 2022 Report</a>
          </div>
          <div>
            AI assistance:{" "}
            Grok
            {" · "}
            Gemini
            {" · "}
            Anthropic (Claude · Claude Code)
            {" · "}
            OpenAI (ChatGPT · Codex)
            {" · "}
            GitHub Copilot
            {" · "}
            Canva
          </div>
        </footer>

      </div>
    </div>
  );
}
