import {login} from '../actions';

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{error?: string}>;
}) {
  const {error} = await searchParams;

  return (
    <div className="admin-login">
      <form className="admin-login__card" action={login}>
        <h1>EFDA admin</h1>
        <div className="admin-field">
          <label htmlFor="password">Password</label>
          <input
            className="admin-input"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
          />
        </div>
        {error ? <p className="admin-error">Wrong password.</p> : null}
        <button className="admin-btn admin-btn--primary" type="submit">
          Log in
        </button>
      </form>
    </div>
  );
}
