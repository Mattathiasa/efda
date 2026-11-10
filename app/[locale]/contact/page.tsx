import type {Metadata} from 'next';
import {useLocale, useTranslations} from 'next-intl';
import {SiteHeader} from '@/components/SiteHeader';
import {SiteFooter} from '@/components/SiteFooter';
import {ContactForm} from '@/components/ContactForm';
import {FormWatermark} from '@/components/Watermarks';
import {PhoneIcon, MailIcon} from '@/components/icons';
import {buildMetadata, BreadcrumbJsonLd} from '@/lib/seo';
import {getSiteConfig} from '@/lib/site-config';
import type {SiteConfig} from '@/lib/site-config-shared';
import type {Locale} from '@/i18n/routing';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  return buildMetadata(locale, 'contact', '/contact');
}

interface PersonCopy {
  dept: string;
  role: string;
}

export default async function ContactPage() {
  const config = await getSiteConfig();
  return <ContactPageContent config={config} />;
}

/* See app/[locale]/page.tsx for why this is a separate sync component. */
function ContactPageContent({config}: {config: SiteConfig}) {
  const t = useTranslations('contact');
  const c = useTranslations('common');
  const locale = useLocale();
  const people = t.raw('people') as PersonCopy[];
  const dept2Override = config.dept2[locale as Locale];

  return (
    <>
      <a className="skip-link" href="#main">
        {c('skip')}
      </a>
      <SiteHeader variant="light" current="navContact" />

      <main id="main">
        <section className="page-head" style={{paddingBottom: 'var(--section-y)'}}>
          <div className="container">
            <p className="label">{t('pageLabel')}</p>
            <div className="split split--wide" style={{gap: '32px 80px'}}>
              <h1 className="h-page h-contact">{t('h1')}</h1>
              <p className="lead">{t('intro')}</p>
            </div>

            <div className="contact-grid" data-reveal-group>
              <div>
                <div className="contacts">
                  {config.contacts.map((person, i) => (
                    <div className="contact" key={person.email}>
                      <div>
                        <p className="contact__dept">
                          {i === 2 && dept2Override ? dept2Override : people[i].dept}
                        </p>
                        <h2 lang="en">{person.name}</h2>
                        <p className="contact__role">{people[i].role}</p>
                      </div>
                      <div className="contact__actions">
                        <a className="act" href={`tel:${person.phone.tel}`}>
                          <PhoneIcon />
                          {person.phone.display}
                        </a>
                        <a className="act" href={`mailto:${person.email}`}>
                          <MailIcon />
                          {person.email}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="auto-grid addresses">
                  <div>
                    <h3>{t('headOffice')}</h3>
                    <p>
                      <span>{t('address1')}</span>
                      <br />
                      <span>{t('address2')}</span>
                      <br />
                      {config.street ? (
                        <span>{config.street}</span>
                      ) : (
                        <span className="tbd">{t('streetTbd')}</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <h3>{t('fieldOffices')}</h3>
                    <p>
                      <span>{t('officeWoliso')}</span>
                      <br />
                      <span>{t('officeShambu')}</span>
                      <br />
                      <span>{t('officeAsosa')}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="form-card on-dark">
                <FormWatermark />
                <ContactForm replyDays={config.replyDays} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <BreadcrumbJsonLd locale={locale} page="contact" label={c('navContact')} />
      <SiteFooter variant="simple" ns="contact" />
    </>
  );
}
