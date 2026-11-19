// Every project in EFDA's funding history, 1999 to 2025, from the record in
// its due-diligence folder. Project titles and districts live in the locale
// copy at t.partners.funding[i], joined by position.
//
// AMOUNTS ARE DELIBERATELY ABSENT. The source table mixes ETB, EUR, USD and
// CHF, transposes the amount and period columns on several rows, and prefixes
// one figure with a question mark. Donor, period and district are unambiguous;
// the money is not. See the README before adding figures.
export interface Grant {
  id: string;
  /** As the donor writes its own name; stays Latin script in every language. */
  donor: string;
  from: number;
  /** Omitted where the record gives a single year or none. */
  to?: number;
}

// Newest first - a funder scanning this wants the recent record.
export const funding: Grant[] = [
  {id: 'rh-arsi', donor: 'Packard Foundation, through CCRDA', from: 2023, to: 2025},
  {id: 'enset-woliso', donor: 'Swiss Development Corporation (SDC)', from: 2023, to: 2024},
  {id: 'peace-alliance', donor: 'USAID', from: 2023, to: 2024},
  {id: 'peace-youth', donor: 'USAID', from: 2023, to: 2024},
  {id: 'education-bg', donor: 'Education Development Trust', from: 2021, to: 2022},
  {id: 'speed-school-babile', donor: 'Geneva Global', from: 2020},
  {id: 'livelihood-girls', donor: 'CSSP, with the British Council', from: 2019, to: 2022},
  {id: 'alfa', donor: 'Geneva Global', from: 2017, to: 2018},
  {id: 'apiculture', donor: 'Swiss Church Aid (HEKS)', from: 2015, to: 2018},
  {id: 'climate-resilience', donor: 'Christian Aid', from: 2014, to: 2016},
  {id: 'climate-window', donor: 'Christian Aid, with CSSP', from: 2014, to: 2016},
  {id: 'vaccination', donor: 'Federal Ministry of Health · GAVI', from: 2014, to: 2017},
  {id: 'social-accountability', donor: 'The World Bank', from: 2013},
  {id: 'women-girls-mao-komo', donor: 'Pact Ethiopia', from: 2012, to: 2013},
  {id: 'chato-forest', donor: 'SIDA, through CCRDA', from: 2007, to: 2014},
  {id: 'school-quality', donor: 'Educkan Foundation', from: 2007, to: 2015},
  {id: 'plwa-ovc', donor: 'World Learning, with USAID', from: 2007, to: 2009},
  {id: 'quality-education', donor: 'Roger Federer Foundation', from: 2007, to: 2009},
  {id: 'abe-woliso', donor: 'Pestalozzi Children’s Foundation', from: 2007, to: 2008},
  {id: 'livelihood-horro', donor: 'Swiss Church Aid (HEKS)', from: 2006, to: 2007},
  {id: 'spring-development', donor: 'Embassy of Ireland', from: 2006},
  {id: 'reproductive-health', donor: 'Pact Ethiopia', from: 2006, to: 2009},
  {id: 'women-empowerment', donor: 'Embassy of Germany', from: 2001},
  {id: 'abe-skills', donor: 'Pestalozzi Children’s Foundation', from: 1999, to: 2012}
];
