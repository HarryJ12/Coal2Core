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

  const handleSelectPlant = useCallback((plant: CoalPlant | null) => {
    setSelectedPlant(plant);
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

  return (
    <div className="flex overflow-hidden bg-[#0a0a0a]" style={{ height: 'calc(100vh - 4rem)' }}>
      <Sidebar
        visiblePlants={visiblePlants}
        filterState={filterState}
        onFilterChange={setFilterState}
      />
      <MapComponent onSelectPlant={handleSelectPlant} filteredIds={filteredIds} />
      <InfoPanel plant={selectedPlant} stressTest={filterState.stressTest} />
    </div>
  );
}
