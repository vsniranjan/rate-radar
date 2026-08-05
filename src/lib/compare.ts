import { unstable_cache } from "next/cache";

import { getIDFCRate } from "./rates/idfc";
import { getMarketRate } from "./rates/market";
import { fetchIOBRates } from "./rates/iob";
import { fetchMulyaRate } from "./rates/mulya";
import { fetchSkydoRate } from "./rates/skydo";
import { fetchInfinityAppRates } from "./rates/infinityApp";

import {
  calcIDFC,
  calcIOB,
  calcSkydo,
  calcMulya,
  calcInfinityApp,
  calcICICI,
} from "./calculation";

const getCachedIDFCRate = unstable_cache(getIDFCRate, ["idfc-rate"], {
  revalidate: 10,
});
const getCachedIOBRates = unstable_cache(fetchIOBRates, ["iob-rate"], {
  revalidate: 10,
});
const getCachedMulyaRate = unstable_cache(fetchMulyaRate, ["mulya-rate"], {
  revalidate: 10,
});
const getCachedSkydoRate = unstable_cache(fetchSkydoRate, ["skydo-rate"], {
  revalidate: 10,
});
const getCachedInfinityAppRates = unstable_cache(
  fetchInfinityAppRates,
  ["infinityapp-rate"],
  { revalidate: 10 },
);
const getCachedMarketRate = unstable_cache(getMarketRate, ["market-rate"], {
  revalidate: 10,
});

const PROVIDERS = [
  { name: "IDFC", fetch: getCachedIDFCRate },
  { name: "IOB", fetch: getCachedIOBRates },
  { name: "Skydo", fetch: getCachedSkydoRate },
  { name: "Mulya", fetch: getCachedMulyaRate },
  { name: "Infinity App", fetch: getCachedInfinityAppRates },
  { name: "Market", fetch: getCachedMarketRate },
];

const fetchAllRates = () =>
  Promise.allSettled([
    getCachedIDFCRate(),
    getCachedIOBRates(),
    getCachedSkydoRate(),
    getCachedMulyaRate(),
    getCachedInfinityAppRates(),
    getCachedMarketRate(),
  ]);

export async function compareAllRates(amtUSD: number) {
  type Variant = "best" | "default" | "worst";
  const results = await fetchAllRates();

  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(PROVIDERS[i].name, r.reason);
  });

  const [idfc, iob, skydo, mulya, infinityApp, market] = results;
  // const [iob, skydo, mulya, infinityApp, market] = results;

  const idfcRate = idfc.status === "fulfilled" ? idfc.value : null;
  const iobRate = iob.status === "fulfilled" ? iob.value : null;
  const mulyaDetails = mulya.status === "fulfilled" ? mulya.value : null;
  const skydoDetails = skydo.status === "fulfilled" ? skydo.value : null;
  const infinityAppDetails =
    infinityApp.status === "fulfilled" ? infinityApp.value : null;
  const marketDetails = market.status === "fulfilled" ? market.value : null;

  const rawData = [
    idfcRate && marketDetails
      ? {
          ...calcIDFC(amtUSD, marketDetails.rate, idfcRate),
          name: "IDFC",
          status: "ok" as const,
        }
      : { name: "IDFC", status: "error" as const },
    iobRate && marketDetails
      ? {
          ...calcIOB(amtUSD, marketDetails.rate, iobRate),
          name: "IOB",
          status: "ok" as const,
        }
      : { name: "IOB", status: "error" as const },
    mulyaDetails
      ? {
          ...calcMulya(amtUSD, mulyaDetails.fx_rate),
          name: "Mulya",
          status: "ok" as const,
        }
      : { name: "Mulya", status: "error" as const },
    skydoDetails
      ? {
          ...calcSkydo(amtUSD, skydoDetails.fx_rate),
          name: "Skydo",
          status: "ok" as const,
        }
      : { name: "Skydo", status: "error" as const },
    infinityAppDetails
      ? {
          ...calcInfinityApp(amtUSD, infinityAppDetails.fx_rate),
          name: "InfinityApp",
          status: "ok" as const,
        }
      : { name: "InfinityApp", status: "error" as const },
    marketDetails
      ? {
          ...calcICICI(amtUSD, marketDetails.rate),
          name: "ICICI",
          note: "Toptal member only offer. Mid-market rate, no forex markup",
          status: "ok" as const,
        }
      : { name: "ICICI", status: "error" as const },
  ];

  const validData = rawData.filter((d) => d.status === "ok");
  const errorData = rawData.filter((d) => d.status === "error");

  const sortedData = [
    ...validData
      .sort((a, b) => b.effectiveRate - a.effectiveRate)
      .map((item, index, arr) => ({
        ...item,
        type: (index === arr.length - 1
          ? "worst"
          : index === 0
            ? "best"
            : "default") as Variant,
      })),
    ...errorData,
  ];

  return { data: sortedData, marketRate: marketDetails ?? null };
}
