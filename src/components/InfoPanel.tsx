'use client';

import type { CoalPlant, StressTest } from '@/lib/types';
import {
  isPlantRetired,
  getCapex,
  getLCOE,
  getNPV,
  getAIDataCenters,
  getMonteCarloRobustness,
  formatCO2,
  getSuitabilityLabel,
} from '@/lib/coalPlantData';

interface InfoPanelProps {
  plant: CoalPlant | null;
  stressTest: StressTest;
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-[15px] font-semibold tabular-nums w-8 text-right`}
        style={{ color: color.includes('emerald') ? '#34d399' : color.includes('sky') ? '#38bdf8' : '#a3a3a3' }}>
        {score}
      </span>
    </div>
  );
}

function EconRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-zinc-800/70 last:border-0">
      <span className="text-[11px] text-zinc-500">{label}</span>
      <span className={`text-[12px] font-mono tabular-nums ${highlight ? 'text-emerald-400 font-semibold' : 'text-zinc-200'}`}>
        {value}
      </span>
    </div>
  );
}


export default function InfoPanel({ plant, stressTest }: InfoPanelProps) {
  if (!plant) {
    return (
      <aside className="w-80 shrink-0 bg-zinc-950 border-l border-zinc-800 flex flex-col items-center justify-center">
        <div className="text-center px-8">
          <div className="w-10 h-10 mx-auto mb-4 rounded-full border border-zinc-700 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-zinc-600" />
          </div>
          <p className="text-[11px] font-mono tracking-[0.1em] text-zinc-500 uppercase">
            Plant View
          </p>
          <p className="mt-2 text-[12px] text-zinc-600 leading-relaxed">
            Select a site on the map to open plant-level analysis
          </p>
        </div>
      </aside>
    );
  }

  const retired = isPlantRetired(plant);
  const capex = getCapex(plant, stressTest);
  const lcoe = getLCOE(plant, stressTest);
  const npv = getNPV(plant, stressTest);
  const aiCenters = getAIDataCenters(plant);
  const robustness = getMonteCarloRobustness(plant);
  const label = getSuitabilityLabel(plant.suitability_score);

  const scoreColorClass =
    plant.suitability_score >= 85 ? 'bg-emerald-500' : plant.suitability_score >= 75 ? 'bg-yellow-500' : 'bg-red-500';
  const scoreTextColor =
    plant.suitability_score >= 85 ? 'text-emerald-400' : plant.suitability_score >= 75 ? 'text-yellow-400' : 'text-red-400';

  return (
    <aside className="w-80 shrink-0 bg-zinc-950 border-l border-zinc-800 flex flex-col overflow-y-auto">

      {/* Identity Header */}
      <div className="px-5 pt-5 pb-4 border-b border-zinc-800">
        <p className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase mb-1">
          Plant View
        </p>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h2 className="text-[14px] font-semibold text-white leading-tight flex-1">
            {plant.name}
          </h2>
          <span className={[
            'shrink-0 text-[9px] font-mono px-2 py-1 rounded border tracking-widest uppercase font-bold',
            retired
              ? 'bg-amber-500/20 border-amber-600 text-amber-400'
              : 'bg-emerald-500/15 border-emerald-700 text-emerald-400',
          ].join(' ')}>
            {plant.status}
          </span>
        </div>
        <p className="text-[11px] text-zinc-500 font-mono">
          {plant.state} &mdash; EIA #{plant.plant_id}
        </p>
        <p className="text-[10px] text-zinc-600 font-mono mt-0.5">
          {plant.lat.toFixed(4)}°N, {Math.abs(plant.lon).toFixed(4)}°W
          {plant.retirement_year ? ` · Retired ${plant.retirement_year}` : ''}
        </p>
      </div>

      {/* Technical Metrics */}
      <div className="px-5 py-4 border-b border-zinc-800">
        <p className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase mb-3">
          Technical Metrics
        </p>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[11px] text-zinc-400">
                {plant.verified ? 'SVR Suitability Score' : 'Predicted Score'}
              </span>
              <span className={`text-[11px] font-mono ${scoreTextColor}`}>{label}</span>
            </div>
            <ScoreBar score={Math.round(plant.suitability_score)} color={scoreColorClass} />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[11px] text-zinc-400">Monte Carlo Robustness</span>
              <span className="text-[11px] font-mono text-sky-400">/ 100</span>
            </div>
            <ScoreBar score={robustness} color="bg-sky-500" />
            <p className="text-[10px] text-zinc-600 mt-1">
              Probability of remaining top-tier under uncertainty
            </p>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-zinc-500">Capacity</span>
            <span className="text-[12px] font-mono text-zinc-200">{plant.capacity_mw.toLocaleString()} MW</span>
          </div>
        </div>
      </div>

      {/* Economics */}
      <div className="px-5 py-4 border-b border-zinc-800">
        <p className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase mb-2">Economics</p>
        <EconRow label="Estimated CapEx" value={`$${capex}B`} />
        <EconRow label="LCOE" value={`${lcoe} $/MWh`} />
        <EconRow
          label="40-Year NPV"
          value={`${npv >= 0 ? '+' : ''}$${npv.toFixed(2)}B`}
          highlight={npv >= 0}
        />
      </div>

      {/* Impact */}
      <div className="px-5 py-6 border-b border-zinc-800">
        <p className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase mb-3">
          Impact
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-zinc-900 rounded-md px-3 py-2.5 border border-zinc-800">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Annual CO₂ Cut</p>
            <p className="text-[16px] font-semibold text-white tabular-nums">
              {formatCO2(plant.co2_reduction)}
            </p>
            <p className="text-[9px] text-zinc-600 mt-0.5">metric tons / yr</p>
          </div>
          <div className="bg-zinc-900 rounded-md px-3 py-2.5 border border-zinc-800">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">AI Data Centers</p>
            <p className="text-[16px] font-semibold text-emerald-400 tabular-nums">{aiCenters}</p>
            <p className="text-[9px] text-zinc-600 mt-0.5">campuses powered</p>
          </div>
        </div>
        <div className="border-t border-transparent mt-3" />
        <p className="mt-3 mb-4 text-[11px] text-transparent leading-relaxed">
          Each site is sized based on the energy it can produce.
        </p>
      </div>

    </aside>
  );
}
