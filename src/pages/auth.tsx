import { FormEvent, useMemo, useState } from 'react';
import { LineChart } from 'lucide-react';
import { Notice } from '@/components/ui/page';
import { useAuth } from '@/hooks/auth-context';

type Mode = 'login' | 'signup';

type AuthForm = {
  username: string;
  displayName: string;
  email: string;
  password: string;
};

const initialForm: AuthForm = {
  username: '',
  displayName: '',
  email: '',
  password: '',
};

export function AuthPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [form, setForm] = useState<AuthForm>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationError = useMemo(() => validate(form, mode), [form, mode]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextError = validate(form, mode);
    if (nextError) {
      setError(nextError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === 'login') {
        await login({ username: form.username, password: form.password });
      } else {
        await signup({
          username: form.username,
          displayName: form.displayName,
          email: form.email,
          password: form.password,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setError(null);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500 text-slate-950">
            <LineChart className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-950">StockTracker</h1>
            <p className="text-sm text-slate-500">Sign in to your portfolio workspace</p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 grid grid-cols-2 rounded-md bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`rounded px-3 py-2 text-sm font-semibold ${
                mode === 'login' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`rounded px-3 py-2 text-sm font-semibold ${
                mode === 'signup' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
              }`}
            >
              Sign up
            </button>
          </div>

          {error && <Notice tone="danger">{error}</Notice>}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Username</span>
              <input
                value={form.username}
                onChange={(event) => setForm({ ...form, username: event.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
                placeholder="yassine"
                autoComplete="username"
              />
            </label>

            {mode === 'signup' && (
              <>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Display name</span>
                  <input
                    value={form.displayName}
                    onChange={(event) => setForm({ ...form, displayName: event.target.value })}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
                    placeholder="Yassine"
                    autoComplete="name"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Email</span>
                  <input
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </label>
              </>
            )}

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500"
                placeholder="Enter your password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </label>

            {validationError && !error && <p className="text-sm text-slate-500">{validationError}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>

          {mode === 'login' && <p className="mt-4 text-center text-xs text-slate-500">Use your account credentials.</p>}
        </div>
      </div>
    </main>
  );
}

function validate(form: AuthForm, mode: Mode) {
  const username = form.username.trim();
  if (username.length < 3) return 'Username must be at least 3 characters.';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores.';
  if (form.password.length < 8) return 'Password must be at least 8 characters.';

  if (mode === 'signup') {
    if (form.displayName.trim().length < 2) return 'Display name must be at least 2 characters.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Enter a valid email address.';
  }

  return null;
}
