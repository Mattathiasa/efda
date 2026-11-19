import {networks} from '@/content/networks';

export interface NetworkCopy {
  name: string;
}

/* Membership bodies, as abbreviation plus the name spelled out. Same grid and
   rhythm as DonorRoll, because they are read the same way - a scan for a name
   you recognise. */
export function NetworkList({copy}: {copy: NetworkCopy[]}) {
  return (
    <ul className="auto-grid donors" data-reveal-group>
      {networks.map((network, i) => (
        <li className="donor" key={network.abbr}>
          <span lang="en">{network.abbr}</span>
          <span className="donor__full">{copy[i].name}</span>
        </li>
      ))}
    </ul>
  );
}
