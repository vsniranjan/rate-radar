type CalculationResult = {
  receivingAmtINR: number;
  totalFee: number;
  effectiveRate: number;
  feesExceedAmount?: boolean;
  breakdown: {
    preFee?: {
      description: string;
      amountUSD: number;
    };
    conversion?: {
      description: string;
      amount: number;
      ttBuyRate?: number;
    };
    platformFee?: {
      description: string;
      amount: number;
    };
    additionalFees?: Array<{
      description: string;
      amount: number;
    }>;
  };
};

const gstRate = 0.18;
const toptalWireRate = 10; // 10 USD
const iciciMarkupPerUSD = 0.08; // 8 paise markup on mid-market rate

export const calcBankCharges = (amtINRUsingTTRate: number): number => {
  const taxableValue = (() => {
    if (amtINRUsingTTRate < 100000) {
      return 0.01 * amtINRUsingTTRate > 250 ? 0.01 * amtINRUsingTTRate : 250;
    } else if (amtINRUsingTTRate < 1000000) {
      return 1000 + 0.005 * (amtINRUsingTTRate - 100000);
    } else {
      return 5500 + 0.001 * (amtINRUsingTTRate - 1000000);
    }
  })();

  const gstOnTaxableValue = gstRate * taxableValue;
  return gstOnTaxableValue;
};

export const calcMulya = (amtUSD: number, rate: number): CalculationResult => {
  const amtINR = amtUSD * rate;
  const totalFee = Number((amtINR * 0.01).toFixed(2));
  const rawReceivingAmt = amtINR - totalFee;
  const receivingAmtINR = Number(Math.max(0, rawReceivingAmt).toFixed(2));
  const effectiveRate = Number((receivingAmtINR / amtUSD).toFixed(4));

  const breakdown = {
    conversion: {
      description: "Mid-market conversion",
      amount: amtINR,
    },
    platformFee: {
      description: "1% of gross amount",
      amount: totalFee,
    },
    additionalFees: [],
  };

  return {
    receivingAmtINR,
    totalFee,
    effectiveRate,
    feesExceedAmount: rawReceivingAmt < 0,
    breakdown,
  };
};

export const calcInfinityApp = (
  amtUSD: number,
  rate: number,
): CalculationResult => {
  const amtINR = amtUSD * rate;

  const totalFee = Number((amtINR * 0.005).toFixed(2));
  const rawReceivingAmt = amtINR - totalFee;
  const receivingAmtINR = Number(Math.max(0, rawReceivingAmt).toFixed(2));

  const effectiveRate = Number((receivingAmtINR / amtUSD).toFixed(4));

  const breakdown = {
    conversion: {
      description: "Mid-market conversion",
      amount: amtINR,
    },
    platformFee: {
      description: "0.5% fee",
      amount: totalFee,
    },
    additionalFees: [],
  };

  return {
    receivingAmtINR,
    totalFee,
    effectiveRate,
    feesExceedAmount: rawReceivingAmt < 0,
    breakdown,
  };
};

export const calcSkydo = (amtUSD: number, rate: number): CalculationResult => {
  const amtINR = amtUSD * rate;
  const transactionFee = (() => {
    if (amtUSD < 2000) return 19 * rate;
    if (amtUSD < 10000) return 29 * rate;
    return 0.003 * amtINR;
  })();

  const gstOnTransactionFee = transactionFee * gstRate;

  const totalFee = Number((transactionFee + gstOnTransactionFee).toFixed(2));
  const rawReceivingAmt = amtINR - totalFee;
  const receivingAmtINR = Number(Math.max(0, rawReceivingAmt).toFixed(2));

  const effectiveRate = Number((receivingAmtINR / amtUSD).toFixed(4));

  const breakdown = {
    conversion: {
      description: "Mid-market conversion",
      amount: amtINR,
    },
    platformFee: {
      description: "Transaction fee",
      amount: transactionFee,
    },
    additionalFees: [
      {
        description: "GST on transaction fee",
        amount: gstOnTransactionFee,
      },
    ],
  };

  return {
    receivingAmtINR,
    totalFee,
    effectiveRate,
    feesExceedAmount: rawReceivingAmt < 0,
    breakdown,
  };
};

export const calcIDFC = (
  amtUSD: number,
  ttBuyRate: number,
): CalculationResult => {
  const netAmtUSD = Math.max(0, amtUSD - toptalWireRate);
  const amtINRUsingTTRate = netAmtUSD * ttBuyRate;
  const gstOnTaxableValue = calcBankCharges(amtINRUsingTTRate);
  const totalFee = Number(gstOnTaxableValue.toFixed(2));
  const rawReceivingAmt = amtINRUsingTTRate - totalFee;
  const receivingAmtINR = Number(Math.max(0, rawReceivingAmt).toFixed(2));
  const effectiveRate = Number((receivingAmtINR / amtUSD).toFixed(4));

  const breakdown = {
    preFee: {
      description: "Toptal Wire Fee",
      amountUSD: toptalWireRate,
    },
    conversion: {
      description: "Amount using TT Buy Rate",
      amount: amtINRUsingTTRate,
      ttBuyRate,
    },
    additionalFees: [
      {
        description: "Currency Conversion Tax",
        amount: gstOnTaxableValue,
      },
    ],
  };

  return {
    receivingAmtINR,
    totalFee,
    effectiveRate,
    feesExceedAmount: rawReceivingAmt < 0,
    breakdown,
  };
};

export const calcIOB = (
  amtUSD: number,
  ttBuyRate: number,
): CalculationResult => {
  const netAmtUSD = Math.max(0, amtUSD - toptalWireRate);
  const amtINRUsingTTRate = netAmtUSD * ttBuyRate;
  const gstOnTaxableValue = calcBankCharges(amtINRUsingTTRate);
  const IRCFee = 500;
  const gstOnIRC = IRCFee * gstRate;
  const IRCTotalFee = IRCFee + gstOnIRC;
  const totalFee = Number((gstOnTaxableValue + IRCTotalFee).toFixed(2));
  const rawReceivingAmt = amtINRUsingTTRate - totalFee;
  const receivingAmtINR = Number(Math.max(0, rawReceivingAmt).toFixed(2));
  const effectiveRate = Number((receivingAmtINR / amtUSD).toFixed(4));

  const breakdown = {
    preFee: {
      description: "Toptal Wire Fee",
      amountUSD: toptalWireRate,
    },
    conversion: {
      description: "Amount using TT Buy Rate",
      amount: amtINRUsingTTRate,
      ttBuyRate,
    },

    additionalFees: [
      {
        description: "Currency Conversion Tax",
        amount: gstOnTaxableValue,
      },
      {
        description: "IRC fee + 18% GST",
        amount: IRCTotalFee,
      },
    ],
  };

  return {
    receivingAmtINR,
    totalFee,
    effectiveRate,
    feesExceedAmount: rawReceivingAmt < 0,
    breakdown,
  };
};

export const calcICICI = (amtUSD: number, rate: number): CalculationResult => {
  const netAmtUSD = Math.max(0, amtUSD - toptalWireRate);
  const iciciRate = rate - iciciMarkupPerUSD;
  const amtINR = netAmtUSD * iciciRate;
  const gstOnTaxableValue = calcBankCharges(amtINR);
  const IRCFee = 500;
  const gstOnIRC = IRCFee * gstRate;
  const IRCTotalFee = IRCFee + gstOnIRC;
  const totalFee = Number((gstOnTaxableValue + IRCTotalFee).toFixed(2));
  const rawReceivingAmt = amtINR - totalFee;
  const receivingAmtINR = Number(Math.max(0, rawReceivingAmt).toFixed(2));
  const effectiveRate = Number((receivingAmtINR / amtUSD).toFixed(4));

  const breakdown = {
    preFee: {
      description: "Toptal Wire Fee",
      amountUSD: toptalWireRate,
    },
    conversion: {
      description: "ICICI rate (mid-market − 8p)",
      amount: amtINR,
      ttBuyRate: iciciRate,
    },
    additionalFees: [
      {
        description: "Currency Conversion Tax",
        amount: gstOnTaxableValue,
      },
      {
        description: "IRC fee + 18% GST",
        amount: IRCTotalFee,
      },
    ],
  };

  return {
    receivingAmtINR,
    totalFee,
    effectiveRate,
    feesExceedAmount: rawReceivingAmt < 0,
    breakdown,
  };
};
