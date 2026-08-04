type MulyaRateResponse = {
  message: string;
  details: {
    rate: number;
  };
};

export async function fetchMulyaRate() {
  const res = await fetch("https://app.mulya.co/api/site/liveRate/USDINR", {
    headers: {
      Referer: "https://app.mulya.co",
      Origin: "https://app.mulya.co",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Mulya rates! ${res.status}`);
  }

  const data: MulyaRateResponse = await res.json();

  const fx_rate = data.details.rate;

  return { fx_rate, api_timestamp: new Date().toISOString() };
}
