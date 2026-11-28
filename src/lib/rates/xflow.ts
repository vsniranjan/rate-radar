type XflowQuote = {
  payout_amount: { amount: string };
  quote: { mid_market: string };
};

export async function fetchXflowRate(amtUSD: number) {
  const res = await fetch(
    `https://www.xflowpay.com/calculate/payout?currency=USD&amount=${amtUSD}`,
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch Xflow rates! ${res.status}`);
  }

  const data: { starter: XflowQuote; growth: XflowQuote } = await res.json();

  for (const result of [data.starter, data.growth]) {
    const amount = Number(result.payout_amount.amount);
    const rate = Number(result.quote.mid_market);
    if (
      !Number.isFinite(amount) || amount < 0 ||
      !Number.isFinite(rate) || rate <= 0
    ) {
      throw new Error("Invalid Xflow quote");
    }
  }

  const plan =
    Number(data.starter.payout_amount.amount) >= Number(data.growth.payout_amount.amount)
      ? "starter"
      : "growth";

  return {
    plan: plan === "starter" ? "Starter" : "Growth",
    receivingAmtINR: Number(data[plan].payout_amount.amount),
    fx_rate: Number(data[plan].quote.mid_market),
  };
}
