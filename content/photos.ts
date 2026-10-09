// Static imports give next/image the intrinsic dimensions for free and let the
// files be content-hashed. Sources are 748-1586px scans from EFDA's January
// 2024 printed profile - never render them larger than they are.
import apples from '@/public/photos/apples.jpg';
import classroom from '@/public/photos/classroom.jpg';
import elders from '@/public/photos/elders.jpg';
import girlsReading from '@/public/photos/girls-reading.jpg';
import hives from '@/public/photos/hives.jpg';
import honey from '@/public/photos/honey.jpg';
import hydro from '@/public/photos/hydro.jpg';
import library from '@/public/photos/library.jpg';
import officeShambu from '@/public/photos/office-shambu.jpg';
import officeWoliso from '@/public/photos/office-woliso.jpg';
import pottery from '@/public/photos/pottery.jpg';
import schoolCrowd from '@/public/photos/school-crowd.jpg';
import schoolRed from '@/public/photos/school-red.jpg';
import sewing from '@/public/photos/sewing.jpg';
import stoves from '@/public/photos/stoves.jpg';
import terraces from '@/public/photos/terraces.jpg';
import terracing from '@/public/photos/terracing.jpg';
import treeClass from '@/public/photos/tree-class.jpg';

export const photos = {
  apples,
  classroom,
  elders,
  girlsReading,
  hives,
  honey,
  hydro,
  library,
  officeShambu,
  officeWoliso,
  pottery,
  schoolCrowd,
  schoolRed,
  sewing,
  stoves,
  terraces,
  terracing,
  treeClass
};

export type PhotoKey = keyof typeof photos;
