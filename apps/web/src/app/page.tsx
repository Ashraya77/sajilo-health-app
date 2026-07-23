import { brandColors } from '@sajilo/config';

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-6 py-12">
      <p
        className="text-sm font-semibold uppercase tracking-widest"
        style={{ color: brandColors.primary }}
      >
        Sajilo Health
      </p>
      <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
      <p className="max-w-2xl text-lg text-slate-600">
        The web workspace is ready for dashboard features.
      </p>
    </main>
  );
}
