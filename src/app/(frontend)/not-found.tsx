import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#2e2f31]">
      <Header />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-24 sm:py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          <span className="select-none text-[clamp(16rem,42vw,38rem)] font-bold leading-none tracking-[-0.08em] text-[#f2f5f8]">
            404
          </span>
        </div>

        <div className="relative z-10 flex max-w-2xl flex-col items-center text-center">
          <span className="mb-5 rounded-full bg-[#A8C028]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#7e9418]">
            Page Not Found
          </span>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-[#2e2f31] sm:text-6xl">
            This page took a wrong turn.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-500 sm:text-lg">
            The page you are looking for may have moved, been renamed, or is no longer available.
          </p>
          <Link
            href="/"
            className="mt-9 inline-flex items-center justify-center rounded-lg bg-[#A8C028] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#8f9e22] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A8C028]"
          >
            Go Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
