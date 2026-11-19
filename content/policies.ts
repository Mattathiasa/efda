// The policies and manuals EFDA has in place. Ids only; the titles live in
// t.about.policies[i], by position.
//
// The first five are named from the documents themselves - EFDA's
// due-diligence folder contains four of the manuals plus the strategic plan,
// so their titles and dates are verified. The last three are listed in the
// 2025 organizational profile but were not supplied, so they carry a generic
// title and no date. See the README.
export const policies = [
  'financial',
  'conduct',
  'humanResources',
  'procurement',
  'strategic',
  'safeguarding',
  'child',
  'shg'
] as const;
