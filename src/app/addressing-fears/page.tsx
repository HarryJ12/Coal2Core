const qaCards = [
  {
    category: "SAFETY & MELTDOWN RISK",
    question: "Can an SMR melt down like Chernobyl or Fukushima?",
    answer: [
      "No. Chernobyl had an old, unsafe design with no strong containment. Fukushima failed when a tsunami knocked out backup cooling power.",
      "SMRs use passive safety. They shut down and cool themselves automatically using gravity and natural heat flow, with no need for electricity or operators. U.S. rules require that even in a worst-case accident, radiation stays inside the plant.",
      "The U.S. nuclear industry has operated since the 1950s with zero public radiation fatalities. These plants run reliably over 92% of the time.",
    ],
    stat: { value: "0", label: "Public radiation fatalities from U.S. commercial nuclear power since the 1950s" },
  },
  {
    category: "ENVIRONMENTAL FOOTPRINT & WASTE",
    question: "Is nuclear clean? What about the waste?",
    answer: [
      "On a full lifecycle, mining, building, running, and shutting down, nuclear produces about 12 grams of CO2 per kilowatt-hour, similar to wind and far lower than coal. It needs some cooling water, but old coal sites already have that infrastructure. Nuclear also uses far less land than solar or wind for the same amount of power.",
      "Nuclear does create radioactive spent fuel. Over 60+ years, the entire U.S. fleet has produced about 90,000 metric tons. That would cover a football field roughly 10 yards deep. The fuel is stored in strong dry casks on site that have never leaked radiation. Long-term, the plan is deep underground storage, already working in Finland. Some advanced reactors can reuse spent fuel and produce even less waste.",
    ],
    stat: { value: "12 g CO2/kWh", label: "Nuclear lifecycle emissions, similar to wind, far below coal" },
  },
  {
    category: "COST & CONSTRUCTION",
    question: "Nuclear projects often run over budget and take a long time. Why would SMRs be different?",
    answer: [
      "Big traditional plants are custom-built on site, which leads to delays and overruns. SMRs are mostly built in factories like cars or airplanes, then shipped and assembled. This makes construction more controlled and predictable.",
    ],
    stat: { value: "3-5 Year Builds", label: "Projected SMR construction timeline, compared to 10-20+ years for traditional nuclear plants built on-site from scratch" },
  },
  {
    category: "RENEWABLES COMPARISON",
    question: "Why not just use solar and wind?",
    answer: [
      "Solar and wind are great, but they only make power when the sun shines or wind blows. Data centers and AI need steady electricity 24/7. Without reliable backup, those gaps often get filled by natural gas. Nuclear runs continuously and can help fill the gap with clean power instead of fossil fuels.",
    ],
    stat: { value: "24/7", label: "The always-on power profile that data centers and AI demand" },
  },
  {
    category: "COAL SITE REUSE",
    question: "Why old coal plant sites?",
    answer: [
      "Old coal plants already have grid connections, transmission lines, cooling water systems, and trained workers in place. Reusing them saves time and money compared to building on empty land. It turns retiring coal sites into sources of clean, reliable energy while keeping similar skilled jobs locally.",
    ],
    stat: { value: "Ready-Made", label: "Grid, water, and workforce infrastructure already in place at coal sites" },
  },
];

export default function AddressingFearsPage() {
  return (
    <div className="h-full overflow-y-auto bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-8 py-16">

        {/* Header */}
        <header className="mb-16">
          <h1 className="text-4xl font-bold tracking-widest uppercase text-white mb-4 text-center">
            Addressing Common Concerns
          </h1>
        </header>

        {/* Q&A Cards */}
        <div className="space-y-3">
          {qaCards.map((card) => (
            <article
              key={card.question}
              className="px-6 py-6 bg-[#1a1a1a] border border-[#222222] rounded-sm"
            >
              <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-emerald-400 mb-3">
                {card.category}
              </p>
              <h2 className="text-[16px] font-semibold text-white mb-4 max-w-3xl">
                {card.question}
              </h2>
              <div className="space-y-3">
                {card.answer.map((paragraph, i) => (
                  <p key={i} className="text-[13px] text-zinc-400 leading-relaxed max-w-4xl">
                    {paragraph}
                  </p>
                ))}
              </div>
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
        <footer className="pt-6 pb-10 text-[11px] text-zinc-600 leading-relaxed">
          Nuclear isn't perfect, but its safety record, low emissions, and compact waste make it a
          practical part of a low-carbon energy mix. Coal2Core is a research framework, not a policy
          recommendation.
        </footer>

      </div>
    </div>
  );
}
