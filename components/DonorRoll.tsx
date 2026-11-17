import {funders} from '@/content/funders';

/* The funder roster, laid out to be read rather than scrolled past - the home
   page already has the marquee. Names stay in Latin script in every language,
   so the list is lang="en" as a whole. */
export function DonorRoll() {
  return (
    <ul className="auto-grid donors" lang="en" data-reveal-group>
      {funders.map((name) => (
        <li className="donor" key={name}>
          {name}
        </li>
      ))}
    </ul>
  );
}
