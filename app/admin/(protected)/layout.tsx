import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import Link from 'next/link';
import {SESSION_COOKIE, verifySessionCookieValue} from '@/lib/admin-auth';
import {logout} from '../actions';

export default async function ProtectedAdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies();
  if (!verifySessionCookieValue(jar.get(SESSION_COOKIE)?.value)) {
    redirect('/admin/login');
  }

  return (
    <>
      <header className="admin-bar">
        <nav className="admin-bar__nav">
          <Link href="/admin">Inbox</Link>
          <Link href="/admin/settings">Settings</Link>
        </nav>
        <form action={logout}>
          <button className="admin-btn" type="submit">
            Log out
          </button>
        </form>
      </header>
      <main className="admin-main">{children}</main>
    </>
  );
}
