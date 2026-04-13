export type StatusFilter = 'all' | 'retired' | 'active';
export type StressTest = 'optimistic' | 'base' | 'pessimistic';

export interface CoalPlant {
  id: string;                                        // map_uid
  plant_id: number;                                  // EIA plant ID
  name: string;                                      // plant_name
  state: string;                                     // state abbreviation
  status: 'Operating' | 'Retired';                  // operating status
  category: 'Verified Candidate' | 'Active Coal';   // map category
  capacity_mw: number;                               // nameplate capacity
  lat: number;
  lon: number;
  retirement_year: number | null;
  suitability_score: number;   // validated score (Verified) or predicted_score (Active Coal)
  verified: boolean;           // true = has validated suitability_score
  co2_reduction: number;       // annual CO₂ reduction in metric tons
  annual_generation_mwh: number;
  capex_b: number;             // estimated CapEx in $B (base scenario)
  lcoe: number;                // LCOE in $/MWh (base scenario)
  npv_b: number;               // 40-year NPV in $B (base scenario)
}

export interface FilterState {
  minScore: number;
  statusFilter: StatusFilter;
  stressTest: StressTest;
}
