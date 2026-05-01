import { ReactNode } from 'react';

type PageProps = {
  title: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function Page({ title, eyebrow, actions, children }: PageProps) {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {eyebrow && (
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">{title}</h1>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </header>
      {children}
    </main>
  );
}

export function Notice({
  tone = 'info',
  children,
}: {
  tone?: 'info' | 'danger' | 'success';
  children: ReactNode;
}) {
  const className = {
    info: 'border-sky-200 bg-sky-50 text-sky-800',
    danger: 'border-rose-200 bg-rose-50 text-rose-800',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  }[tone];

  return (
    <div className={`rounded-md border px-4 py-3 text-sm ${className}`}>
      {children}
    </div>
  );
}
