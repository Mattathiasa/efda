import {useTranslations} from 'next-intl';
import {orgLines, orgBoxes} from '@/content/org';

/* Two renderings of the same hierarchy:
   - .org   a fixed 1120x632 absolutely-positioned chart, scrolling sideways
            inside a labelled box; aria-hidden, because reading absolute
            coordinates aloud is meaningless
   - .org-list  an indented tree, which is what screen readers always get and
            what phones show below 720px
   The External Auditor hangs off the Board on a dashed line. */
export function OrgChart({label}: {label: string}) {
  const t = useTranslations('about.chart');

  function sub(box: (typeof orgBoxes)[number]) {
    if (!box.sub) return null;
    return 'key' in box.sub ? t(box.sub.key) : box.sub.name;
  }

  return (
    <>
      <div className="org-wrap" tabIndex={0} aria-label={label}>
        <div className="org" aria-hidden="true">
          {orgLines.map((line, i) => (
            <span
              key={i}
              className={[
                'org__ln',
                `org__ln--${line.axis}`,
                line.dashed ? 'org__ln--dash' : null
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                left: line.left,
                top: line.top,
                ...(line.axis === 'v' ? {height: line.size} : {width: line.size})
              }}
            />
          ))}

          {orgBoxes.map((box) => (
            <div
              key={box.key}
              className={`org__box org__box--${box.variant}`}
              style={{left: box.left, top: box.top}}
            >
              <span>
                <b>{t(box.key)}</b>
                {box.sub ? (
                  <>
                    <br />
                    <span lang={'name' in box.sub ? 'en' : undefined}>{sub(box)}</span>
                  </>
                ) : null}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ul className="org-list">
        <li>
          <div className="org-node org-node--board">
            <b>{t('board')}</b>
            <span>{t('boardSub')}</span>
          </div>
          <ul>
            <li>
              <div className="org-node org-node--md">
                <b>{t('md')}</b>
                <span lang="en">Guta Abdi</span>
              </div>
              <ul>
                <li>
                  <div className="org-node org-node--l3">
                    <b>{t('pm')}</b>
                    <span lang="en">Dechassa Sisay</span>
                  </div>
                  <ul>
                    <li>
                      <div className="org-node org-node--l4">
                        <b>{t('pi')}</b>
                        <span>{t('piSub')}</span>
                      </div>
                    </li>
                    <li>
                      <div className="org-node org-node--l4">
                        <b>{t('me')}</b>
                      </div>
                    </li>
                  </ul>
                </li>
                <li>
                  <div className="org-node org-node--l3">
                    <b>{t('fa')}</b>
                  </div>
                  <ul>
                    <li>
                      <div className="org-node org-node--l4">
                        <b>{t('fin')}</b>
                      </div>
                    </li>
                    <li>
                      <div className="org-node org-node--l4">
                        <b>{t('hr')}</b>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <div className="org-node org-node--audit">
            <b>{t('auditor')}</b>
            <span>{t('auditorSub')}</span>
          </div>
        </li>
      </ul>
    </>
  );
}
