import { Suspense } from "react";
import { AmountInput } from "@/components/AmountInput";
import ComparisonField from "@/components/ComparisonField";
import WorkingField from "@/components/WorkingField";
import Feedback from "@/components/Feedback";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ amt?: string }>;
}) {
  const { amt } = await searchParams;

  const parsedAmt = Number(amt);

  const amtParam =
    typeof amt === "string" && Number.isFinite(parsedAmt) && parsedAmt > 0
      ? amt
      : "1000";

  const amtUSD = Number(amtParam);
  return (
    <>
      <header>
        <h1 className='text-6xl font-bold text-primary leading-15'>
          Stop losing money on
          <br />
          international transfers.
        </h1>
        <p className='mt-4 text-muted'>
          Compare forex charges across major banks and fintech platforms <br />
          and pick the option that saves you the most.
        </p>
      </header>

      <AmountInput amtParam={amtParam} />

      <section aria-label='Forex rate comparison results'>
        <Suspense
          key={amtUSD}
          fallback={
            <p className='text-muted text-sm mt-14 mb-8 pl-2 animate-pulse'>
              Fetching latest rates…
            </p>
          }
        >
          <ComparisonField amtUSD={amtUSD} />
        </Suspense>
      </section>

      <section aria-label='How Rate Radar works'>
        <WorkingField />
      </section>

      <footer className='mt-20 border-t border-gray-200/80'>
        <Feedback />
        <div className='py-8 px-2 text-center space-y-4'>
          {/* Brand line */}
          <p className='text-sm text-primary font-semibold tracking-tight'>
            Rate Radar
          </p>

          
          {/* Disclaimer */}
          <p className='text-[11px] text-gray-400 max-w-sm mx-auto leading-relaxed'>
            Rates are for informational purposes only. Always verify with the
            provider before making financial decisions.
          </p>

          {/* Copyright */}
          <p className='text-[11px] text-gray-400'>
            &copy; {new Date().getFullYear()} Rate Radar. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
