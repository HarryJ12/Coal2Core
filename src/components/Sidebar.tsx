'use client';

import type { CoalPlant, FilterState, StatusFilter } from '@/lib/types';
import { coalPlants } from '@/lib/coalPlantData';

interface SidebarProps {
  visiblePlants: CoalPlant[];
  filterState: FilterState;
  onFilterChange: (f: FilterState) => void;
  className?: string;
  onRequestClose?: () => void;
}

const STATUS_OPTS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All Plants' },
  { value: 'retired', label: 'Retired' },
  { value: 'active', label: 'Active Coal' },
];


const highCount = coalPlants.filter((p) => p.suitability_score >= 85).length;
const midCount  = coalPlants.filter((p) => p.suitability_score >= 75 && p.suitability_score < 85).length;
const lowCount  = coalPlants.filter((p) => p.suitability_score < 75).length;

const SCORING_FACTORS = [
  'Grid capacity (MW)',
  'Water access',
  'Seismic risk profile',
  'Population proximity',
  'Regulatory environment',
];

export default function Sidebar({
  visiblePlants: _visiblePlants,
  filterState,
  onFilterChange,
  className,
  onRequestClose,
}: SidebarProps) {
  function set<K extends keyof FilterState>(key: K, val: FilterState[K]) {
    onFilterChange({ ...filterState, [key]: val });
  }


  return (
    <aside className={[
      'w-80 shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col overflow-y-auto',
      className ?? '',
    ].join(' ')}>
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-zinc-800 flex items-start justify-between gap-3">
        <p className="text-[15px] font-mono tracking-[0.15em] text-emerald-400 uppercase leading-tight">
          SMR Suitability Map
        </p>
        {onRequestClose && (
          <button
            type="button"
            onClick={onRequestClose}
            className="lg:hidden inline-flex items-center justify-center w-7 h-7 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
            aria-label="Close filters panel"
          >
            ×
          </button>
        )}
      </div>

      {/* About */}
      <div className="px-5 py-4 border-b border-zinc-800">
        <p className="text-[12px] text-zinc-400 leading-relaxed">
          374 U.S. coal sites scored for SMR conversion viability using grid infrastructure,
          water access, seismic risk, and regulatory data, validated by a machine learning
          model and 1,000-iteration Monte Carlo engine to identify financially robust,
          zero-carbon baseload candidates for next-generation AI infrastructure.
        </p>
      </div>

      {/* Suitability Legend */}
      <div className="px-5 py-4 border-b border-zinc-800">
        <p className="text-[10px] font-mono tracking-[0.15em] text-zinc-500 uppercase mb-3">
          Suitability Legend
        </p>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
              <span className="text-[12px] text-zinc-300">High: Score 85–100</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">{highCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shrink-0" />
              <span className="text-[12px] text-zinc-300">Medium: Score 75–89</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">{midCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
              <span className="text-[12px] text-zinc-300">Low: Score &lt;75</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">{lowCount}</span>
          </div>
        </div>
        <p className="text-[10px] text-zinc-600 mt-3 leading-relaxed">
          Larger circles indicate higher energy output capacity.
        </p>
      </div>

      {/* Scoring Factors */}
      <div className="px-5 py-4 border-b border-zinc-800">
        <p className="text-[10px] font-mono tracking-[0.15em] text-zinc-500 uppercase mb-3">
          Scoring Factors
        </p>
        <ul className="space-y-1.5">
          {SCORING_FACTORS.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0" />
              <span className="text-[12px] text-zinc-400">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Filters */}
      <div className="px-5 py-4 flex flex-col gap-5">
        <p className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase -mb-2">
          Interactive Filters
        </p>

        {/* Score Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-zinc-400">Suitability Score ≥</span>
            <span className="text-[13px] font-mono font-semibold text-emerald-400">
              {filterState.minScore}
            </span>
          </div>
          <input
            type="range"
            min={60}
            max={100}
            step={1}
            value={filterState.minScore}
            onChange={(e) => set('minScore', Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between mt-0.5">
            <span className="text-[10px] text-zinc-600 font-mono">60</span>
            <span className="text-[10px] text-zinc-600 font-mono">100</span>
          </div>
        </div>

        {/* Operating Status */}
        <div>
          <p className="text-[11px] text-zinc-400 mb-2">Operating Status</p>
          <div className="flex gap-1.5">
            {STATUS_OPTS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => set('statusFilter', opt.value)}
                className={[
                  'flex-1 py-1.5 text-[10px] font-mono tracking-wider uppercase rounded border transition-colors duration-150',
                  filterState.statusFilter === opt.value
                    ? opt.value === 'retired'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                      : opt.value === 'active'
                      ? 'bg-sky-500/20 border-sky-600 text-sky-400'
                      : 'bg-emerald-500/20 border-emerald-600 text-emerald-400'
                    : 'bg-transparent border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300',
                ].join(' ')}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="px-5 py-4 mt-auto border-t border-zinc-800">
        <p className="text-[10px] text-zinc-600 leading-relaxed">
          Select a site marker on the map to open the plant-level analysis panel.
        </p>
      </div>
    </aside>
  );
}
