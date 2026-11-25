import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="rounded-[28px] bg-[#222528] text-white p-8 max-w-md space-y-4 shadow-xl">
        <p className="font-mono-code text-xs uppercase tracking-widest text-[#d4fb35]">
          Vex · 404
        </p>
        <h1 className="font-display text-3xl font-normal">Page not found</h1>
        <p className="text-xs text-slate-300">
          Return to your Vex Career Command workspace.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-[#d4fb35] px-5 py-2.5 text-xs font-semibold text-[#15181a]"
        >
          Back to Command
        </Link>
      </div>
    </div>
  );
}
