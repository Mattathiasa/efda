import {hasDb} from '@/lib/db';
import {listMessages} from '@/lib/messages';
import {markMessage} from '../actions';

export default async function AdminInboxPage() {
  if (!hasDb()) {
    return (
      <>
        <h1>Inbox</h1>
        <p className="admin-empty">
          No database configured. Set <code>DATABASE_URL</code> (via{' '}
          <code>vercel integration add neon</code>) to start receiving
          messages here.
        </p>
      </>
    );
  }

  const messages = await listMessages();

  return (
    <>
      <h1>Inbox</h1>
      {messages.length === 0 ? (
        <p className="admin-empty">No messages yet.</p>
      ) : (
        messages.map((m) => (
          <article
            key={m.id}
            className={`admin-message${m.status === 'unread' ? ' admin-message--unread' : ''}`}
          >
            <div className="admin-message__head">
              <span className="admin-message__name">
                {m.name}
                {m.organization ? `, ${m.organization}` : ''}
              </span>
              <span className="admin-badge">{m.topic}</span>
              <span className="admin-badge">{m.status}</span>
              <span className="admin-message__meta">
                {new Date(m.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="admin-message__meta">
              <a href={`mailto:${m.email}`}>{m.email}</a>
              {m.phone ? ` · ${m.phone}` : ''} · {m.locale}
              {m.notified === false && m.notifyError ? ' · notification failed' : ''}
            </p>
            <p className="admin-message__body">{m.body}</p>
            <div className="admin-message__actions">
              {m.status !== 'read' ? (
                <form action={markMessage.bind(null, m.id, 'read')}>
                  <button className="admin-btn" type="submit">
                    Mark read
                  </button>
                </form>
              ) : null}
              {m.status !== 'archived' ? (
                <form action={markMessage.bind(null, m.id, 'archived')}>
                  <button className="admin-btn" type="submit">
                    Archive
                  </button>
                </form>
              ) : null}
              {m.status !== 'unread' ? (
                <form action={markMessage.bind(null, m.id, 'unread')}>
                  <button className="admin-btn" type="submit">
                    Mark unread
                  </button>
                </form>
              ) : null}
            </div>
          </article>
        ))
      )}
    </>
  );
}
