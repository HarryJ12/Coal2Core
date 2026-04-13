'use client';

import { useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { CoalPlant, FilterState } from '@/lib/types';
import { coalPlants, isPlantRetired } from '@/lib/coalPlantData';
import Sidebar from './Sidebar';
import InfoPanel from './InfoPanel';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 bg-[#0a0a0a] flex items-center justify-center">
      <p className="text-[12px] text-neutral-600 font-mono tracking-wider">
        Initializing map...
      </p>
    </div>
  ),
});

const DEFAULT_FILTER: FilterState = {
  minScore: 60,
  statusFilter: 'all',
  stressTest: 'base',
};

export default function Dashboard() {
  const [selectedPlant, setSelectedPlant] = useState<CoalPlant | null>(null);
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTER);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleSelectPlant = useCallback((plant: CoalPlant | null) => {
    setSelectedPlant(plant);
    if (plant) setDetailsOpen(true);
  }, []);

  const visiblePlants = useMemo(() => {
    return coalPlants.filter((p) => {
      if (p.suitability_score < filterState.minScore) return false;
      if (filterState.statusFilter === 'retired' && !isPlantRetired(p)) return false;
      if (filterState.statusFilter === 'active' && isPlantRetired(p)) return false;
      return true;
    });
  }, [filterState]);

  const filteredIds = useMemo(
    () => visiblePlants.map((p) => p.id),
    [visiblePlants]
  );

  const selectedSummary = selectedPlant
    ? `${selectedPlant.name} (${selectedPlant.state})`
    : 'No site selected';

  return (
    <div className="relative flex overflow-hidden bg-[#0a0a0a] h-[calc(100dvh-4rem)]">
      <div className="hidden lg:flex h-full">
        <Sidebar
          visiblePlants={visiblePlants}
          filterState={filterState}
          onFilterChange={setFilterState}
        />
      </div>

      <div className="flex-1 relative min-w-0 h-full">
        <MapComponent onSelectPlant={handleSelectPlant} filteredIds={filteredIds} />

        <div className="lg:hidden absolute top-3 left-3 right-3 z-20">
          <div className="bg-zinc-950/90 border border-zinc-800 rounded-md px-3 py-2 backdrop-blur-sm">
            <p className="text-[10px] tracking-[0.14em] uppercase text-zinc-500 mb-1">Selected Site</p>
            <p className="text-[12px] text-zinc-200 truncate">{selectedSummary}</p>
          </div>
        </div>

        <div className="lg:hidden absolute bottom-4 left-3 right-3 z-20 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="h-11 rounded-md border border-zinc-700 bg-zinc-950/95 text-zinc-100 text-[12px] tracking-wider uppercase"
          >
            Filters
          </button>
          <button
            type="button"
            onClick={() => setDetailsOpen(true)}
            className="h-11 rounded-md border border-emerald-700 bg-emerald-500/15 text-emerald-300 text-[12px] tracking-wider uppercase"
          >
            Details
          </button>
        </div>
      </div>

      <div className="hidden lg:flex h-full">
        <InfoPanel plant={selectedPlant} stressTest={filterState.stressTest} />
      </div>

      {filtersOpen && (
        <div
          className="lg:hidden absolute inset-0 z-30 bg-black/60"
          onClick={() => setFiltersOpen(false)}
        >
          <div className="h-full w-[88%] max-w-sm" onClick={(e) => e.stopPropagation()}>
            <Sidebar
              visiblePlants={visiblePlants}
              filterState={filterState}
              onFilterChange={setFilterState}
              className="w-full h-full"
              onRequestClose={() => setFiltersOpen(false)}
            />
          </div>
        </div>
      )}

      {detailsOpen && (
        <div
          className="lg:hidden absolute inset-0 z-30 bg-black/60 flex justify-end"
          onClick={() => setDetailsOpen(false)}
        >
          <div className="h-full w-[90%] max-w-sm" onClick={(e) => e.stopPropagation()}>
            <InfoPanel
              plant={selectedPlant}
              stressTest={filterState.stressTest}
              className="w-full h-full"
              onRequestClose={() => setDetailsOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
