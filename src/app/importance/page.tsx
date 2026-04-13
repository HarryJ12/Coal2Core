import Image from 'next/image';

export default function ImportancePage() {
  return (
    <div className="h-full overflow-y-auto bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-8 py-16">

        {/* Main Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold tracking-widest uppercase text-white">
            Why It Matters: Decarbonizing the Future
          </h1>
        </div>

        {/* Section 1 — Carbon */}
        <div className="mb-20">
          <h2 className="text-[18px] font-mono tracking-[0.25em] uppercase mb-8 text-emerald-400">
            Understanding Our Carbon Crisis
          </h2>
          <div className="grid grid-cols-2 gap-10">
            <div className="flex flex-col gap-5">
              <p className="text-[13px] text-zinc-400 leading-relaxed">
                Burning carbon from coal, oil, and natural gas remains the primary driver of climate change, with emissions still rising. In 2025, global fossil fuel CO₂ emissions hit a record 38.1 billion tons, pushing atmospheric CO₂ over 52% above pre-industrial levels (now exceeding 429 ppm).
              </p>
              <p className="text-[13px] text-zinc-400 leading-relaxed">
                This excess carbon traps heat, driving higher global temperatures and destabilizing natural systems.
              </p>
              <p className="text-[13px] text-zinc-400 leading-relaxed">
                The result: intensified extreme weather like stronger storms, prolonged droughts, larger wildfires and rising sea levels threatening coastal cities, and disruptions to food production, water supplies, infrastructure, economies, and public health. These effects compound and grow harder to reverse.
              </p>
              <p className="text-[13px] text-zinc-400 leading-relaxed">
                Fossil fuels still dominate reliable, large-scale energy. Wind and solar help but are intermittent. Cutting emissions at scale while keeping the grid stable requires clean, constant 24/7 power.
              </p>
              <p className="text-[13px] text-zinc-400 leading-relaxed">
                Nuclear delivers near-zero carbon emissions, runs continuously at high capacity, and can directly replace fossil plants at existing sites.
              </p>
              <p className="text-[13px] text-zinc-400 leading-relaxed">
                <strong className="text-zinc-200">Bottom line:</strong> Expanding clean baseload energy like nuclear is necessary to reduce emissions rapidly without sacrificing reliability.
              </p>
            </div>
            <div className="relative w-full self-stretch">
              <Image
                src="/carbon-crisis.png"
                alt="Carbon Crisis"
                fill
                sizes="50vw"
                className="object-contain rounded-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 2 — AI */}
        <div>
          <h2 className="text-[18px] font-mono tracking-[0.25em] uppercase mb-6 text-emerald-400">
            AI's Explosive Energy Footprint
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-5">
              <p className="text-[13px] text-zinc-400 leading-relaxed">
                As AI systems and other large-scale models expand rapidly, data centers are being built at an unprecedented pace across the U.S. and around the world. These facilities demand massive amounts of constant, 24/7 power, with zero tolerance for downtime.
              </p>
              <p className="text-[13px] text-zinc-400 leading-relaxed">
                Much of that electricity currently comes from fossil fuels, including coal and natural gas. As a result, the explosive growth of AI is directly driving higher energy consumption and accelerating carbon emissions. More compute means more electricity, which still means more carbon.
              </p>
              <p className="text-[13px] text-zinc-400 leading-relaxed">
                AI isn't slowing down. Demand for compute is surging and will only continue to rise, making this energy demand locked in for the foreseeable future.
              </p>
              <p className="text-[13px] text-zinc-400 leading-relaxed">
                This is the critical inflection point. If we continue powering data centers with fossil fuels, we risk locking in decades of higher emissions. But if we pair AI's growth with clean, reliable baseload energy, particularly nuclear power, we can scale intelligence without scaling carbon.
              </p>
              <p className="text-[13px] text-zinc-400 leading-relaxed">
                Nuclear delivers the high-output, always-on power that data centers require, without the emissions that drive climate instability.
              </p>
              <p className="text-[13px] text-zinc-400 leading-relaxed">
                <strong className="text-zinc-200">Bottom line:</strong> The future of AI and the future of energy are now inseparable. We cannot slow AI down. We must power it correctly.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/ai-energy.png"
                alt="AI Energy Demand"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto rounded-sm"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
