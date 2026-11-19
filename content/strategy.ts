// EFDA's 2024-2028 strategic plan, as published in January 2024. Language-
// independent structure only; all prose lives at t.strategy.*, by position.
export const PLAN_FROM = 2024;
export const PLAN_TO = 2028;

export interface Shift {
  id: string;
}

// The five strategic shifts the plan commits to, in its own order.
export const shifts: Shift[] = [
  {id: 'capacity'},
  {id: 'partnership'},
  {id: 'resources'},
  {id: 'expansion'},
  {id: 'targetGroups'}
];

// The four programme components the plan organises EFDA's work into.
export const components = [
  'socioEconomic',
  'healthRisks',
  'environment',
  'peace'
] as const;
