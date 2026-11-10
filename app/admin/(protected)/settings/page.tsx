import {hasDb} from '@/lib/db';
import {getRawSettings} from '@/lib/site-config';
import {SETTING_FIELDS} from '@/lib/site-config-shared';
import {updateSettings} from '../../actions';

export default async function AdminSettingsPage() {
  if (!hasDb()) {
    return (
      <>
        <h1>Settings</h1>
        <p className="admin-empty">
          No database configured. Set <code>DATABASE_URL</code> (via{' '}
          <code>vercel integration add neon</code>) before editing site
          settings here.
        </p>
      </>
    );
  }

  const stored = await getRawSettings();

  return (
    <>
      <h1>Settings</h1>
      <p className="admin-message__meta" style={{marginBottom: 24}}>
        Leave a field blank to fall back to its environment variable or
        placeholder.
      </p>
      <form action={updateSettings}>
        {SETTING_FIELDS.map((field) => (
          <div className="admin-settings-field" key={field.key}>
            <label htmlFor={field.key}>{field.label}</label>
            <input
              className="admin-input"
              id={field.key}
              name={field.key}
              type="text"
              defaultValue={stored[field.key] ?? ''}
            />
          </div>
        ))}
        <button className="admin-btn admin-btn--primary" type="submit">
          Save
        </button>
      </form>
    </>
  );
}
