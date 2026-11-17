// Static imports give next/image the intrinsic dimensions for free and let the
// files be content-hashed. Sources are 590-1600px: scans from EFDA's January
// 2024 printed profile, and photographs from the 2025 organizational profile -
// never render them larger than they are. Originals live in source-material/,
// which is gitignored; see the README.
import apples from '@/public/photos/apples.jpg';
import boatBuilding from '@/public/photos/boat-building.jpg';
import chituIsland from '@/public/photos/chitu-island.jpg';
import classroom from '@/public/photos/classroom.jpg';
import elders from '@/public/photos/elders.jpg';
import eldersTeaching from '@/public/photos/elders-teaching.jpg';
import ensetPlantation from '@/public/photos/enset-plantation.jpg';
import federerSchool from '@/public/photos/federer-school.jpg';
import federerWaterpoint from '@/public/photos/federer-waterpoint.jpg';
import girlsReading from '@/public/photos/girls-reading.jpg';
import handpump from '@/public/photos/handpump.jpg';
import healthGirls from '@/public/photos/health-girls.jpg';
import hives from '@/public/photos/hives.jpg';
import homestead from '@/public/photos/homestead.jpg';
import honey from '@/public/photos/honey.jpg';
import hydro from '@/public/photos/hydro.jpg';
import kochoProcessing from '@/public/photos/kocho-processing.jpg';
import library from '@/public/photos/library.jpg';
import officeShambu from '@/public/photos/office-shambu.jpg';
import officeWoliso from '@/public/photos/office-woliso.jpg';
import peaceElders from '@/public/photos/peace-elders.jpg';
import peaceWorkshop from '@/public/photos/peace-workshop.jpg';
import ploughing from '@/public/photos/ploughing.jpg';
import pottery from '@/public/photos/pottery.jpg';
import reliefDistribution from '@/public/photos/relief-distribution.jpg';
import schoolBuilt from '@/public/photos/school-built.jpg';
import schoolCrowd from '@/public/photos/school-crowd.jpg';
import schoolRed from '@/public/photos/school-red.jpg';
import sewing from '@/public/photos/sewing.jpg';
import shoeWorkshop from '@/public/photos/shoe-workshop.jpg';
import spring from '@/public/photos/spring.jpg';
import stoveMaking from '@/public/photos/stove-making.jpg';
import stoves from '@/public/photos/stoves.jpg';
import terraces from '@/public/photos/terraces.jpg';
import terracing from '@/public/photos/terracing.jpg';
import treeClass from '@/public/photos/tree-class.jpg';

export const photos = {
  apples,
  boatBuilding,
  chituIsland,
  classroom,
  elders,
  eldersTeaching,
  ensetPlantation,
  federerSchool,
  federerWaterpoint,
  girlsReading,
  handpump,
  healthGirls,
  hives,
  homestead,
  honey,
  hydro,
  kochoProcessing,
  library,
  officeShambu,
  officeWoliso,
  peaceElders,
  peaceWorkshop,
  ploughing,
  pottery,
  reliefDistribution,
  schoolBuilt,
  schoolCrowd,
  schoolRed,
  sewing,
  shoeWorkshop,
  spring,
  stoveMaking,
  stoves,
  terraces,
  terracing,
  treeClass
};

export type PhotoKey = keyof typeof photos;
