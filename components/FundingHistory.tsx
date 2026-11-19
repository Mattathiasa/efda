import {funding} from '@/content/funding';

export interface GrantCopy {
  title: string;
  where: string;
}

/* The funding record as dated rows. Reuses the .row grid the home page uses
   for the project index, in a static variant - these are not links, so the
   hover background and padding shift are cancelled in .rows--static. */
export function FundingHistory({copy}: {copy: GrantCopy[]}) {
  return (
    <div className="rows rows--static" data-reveal-group>
      {funding.map((grant, i) => (
        <div className="row" key={grant.id}>
          <p className="row__where mono">
            {grant.to ? `${grant.from}–${grant.to}` : grant.from}
          </p>
          <p className="row__title">{copy[i].title}</p>
          <p className="row__where">{copy[i].where}</p>
          <p className="row__funder" lang="en">
            {grant.donor}
          </p>
        </div>
      ))}
    </div>
  );
}
