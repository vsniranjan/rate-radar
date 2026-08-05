# Calculation Methodology

This document explains exactly how **Best Conversion Rate** calculates the final INR amount you receive for each platform. All formulas match the logic in [`src/lib/calculation.ts`](./src/lib/calculation.ts).



---

## Table of Contents

- [Key Terms](#key-terms)
- [Fintech Platforms](#fintech-platforms)
  - [Skydo](#skydo)
  - [Mulya](#mulya)
  - [Infinity App](#infinity-app)
- [Banks](#banks)
  - [Bank Charges (Shared Formula)](#bank-charges-shared-formula)
  - [IDFC First Bank](#idfc-first-bank)
  - [Indian Overseas Bank (IOB)](#indian-overseas-bank-iob)
  - [ICICI Bank (Toptal member offer)](#icici-bank-toptal-member-offer)
- [Final Ranking](#final-ranking)

---

## Key Terms

| Term | Definition |
|---|---|
| **Mid-Market Rate** | The "true" exchange rate with no markup or fees. This is the baseline used by all fintech platforms and the reference point for bank comparisons. |
| **TT Buy Rate** | Telegraphic Transfer buying rate — the rate a bank uses to convert incoming foreign wire transfers. Always lower than the mid-market rate. |
| **Effective Rate** | `Receiving Amount ÷ USD Amount` — the real rate you end up getting after all deductions. This is what gets compared. |
| **GST** | Goods & Services Tax at 18%, applied on service/transaction fees in India. |

---

## Fintech Platforms

Fintech platforms (Skydo, Mulya, Infinity App) all use the **mid-market rate with no markup**. The only cost is their platform fee (plus GST where applicable).

### Skydo

Skydo uses a **tiered transaction fee** based on the USD amount, with **18% GST** on top.

#### Fee Structure

| USD Amount | Transaction Fee |
|---|---|
| < $2,000 | $19 × Mid-Market Rate (flat fee in INR) |
| $2,000 – $9,999 | $29 × Mid-Market Rate (flat fee in INR) |
| ≥ $10,000 | 0.3% of INR amount |

#### Formula

```
Amount INR        = USD Amount × Mid-Market Rate
Transaction Fee   = (tiered, see table above)
GST on Fee        = Transaction Fee × 0.18

Total Fee         = Transaction Fee + GST on Fee
Receiving Amount  = Amount INR − Total Fee
Effective Rate    = Receiving Amount ÷ USD Amount
```

---

### Mulya

Mulya charges a flat **1% fee** on the converted INR amount. No tiered pricing.

#### Formula

```
Amount INR        = USD Amount × Mid-Market Rate
Total Fee         = Amount INR × 0.01
Receiving Amount  = Amount INR − Total Fee
Effective Rate    = Receiving Amount ÷ USD Amount
```

---

### Infinity App

Infinity App charges a flat **0.5% fee** on the converted INR amount.

#### Formula

```
Amount INR        = USD Amount × Mid-Market Rate
Total Fee         = Amount INR × 0.005
Receiving Amount  = Amount INR − Total Fee
Effective Rate    = Receiving Amount ÷ USD Amount
```

---

## Banks

Banks work differently. They don't charge a percentage fee on your transfer — instead, they apply a **TT Buy Rate** that is lower than the mid-market rate. The difference between what your USD _should_ be worth (at mid-market) and what the bank gives you (at TT rate) _is_ the forex fee. On top of that, banks charge **service charges with GST**.

### Bank Charges (Shared Formula)

IDFC First Bank, IOB, and ICICI Bank all use the same tiered service charge structure for inward remittances.

#### Service Charge Tiers

| INR Amount (at TT Rate) | Taxable Value |
|---|---|
| < ₹1,00,000 | max(1% of amount, ₹250) |
| ₹1,00,000 – ₹9,99,999 | ₹1,000 + 0.5% of (amount − ₹1,00,000) |
| ≥ ₹10,00,000 | ₹5,500 + 0.1% of (amount − ₹10,00,000) |

The **GST on bank charges** = `Taxable Value × 0.18`

> [!IMPORTANT]
> Only the GST component (`Taxable Value × 0.18`) is treated as an additional out-of-pocket cost. The service charge itself is absorbed into the spread for calculation purposes.

---

### IDFC First Bank

#### Formula

```
Amount INR (TT)       = USD Amount × IDFC TT Buy Rate

Bank Charges GST      = calcBankCharges(Amount INR at TT Rate)

Total Fee             = Bank Charges GST
Receiving Amount      = Amount INR (TT) − Total Fee
Effective Rate        = Receiving Amount ÷ USD Amount
```

The forex cost is not billed as a separate line item — it is already baked into the lower TT Buy Rate.

---

### Indian Overseas Bank (IOB)

IOB works similarly to IDFC but charges an additional **IRC (Inward Remittance Certificate) fee** of ₹500 + 18% GST, plus the **Toptal wire fee** of $10.

#### Formula

```
Amount INR (TT)       = USD Amount × IOB TT Buy Rate

Bank Charges GST      = calcBankCharges(Amount INR at TT Rate)

IRC Fee               = ₹500
GST on IRC            = 500 × 0.18 = ₹90
IRC Total             = ₹590

Toptal Wire Fee       = $10 × Mid-Market Rate

Total Fee             = Bank Charges GST + IRC Total + Toptal Wire Fee
Receiving Amount      = Amount INR (TT) − Total Fee
Effective Rate        = Receiving Amount ÷ USD Amount
```

---

### ICICI Bank (Toptal member offer)

ICICI is a special case. There is **no rate to fetch** — Toptal members receive the **mid-market rate with zero forex markup** on inward remittances, so the mid-market rate from Frankfurter is used directly as the conversion rate. Everything else matches IOB: tiered service charge GST, IRC fee, and the Toptal wire fee.

> [!NOTE]
> This is a negotiated rate available to Toptal members only. If you are not remitting through Toptal, ICICI applies its own TT Buy Rate and this row will not reflect what you receive.

#### Formula

```
Amount INR            = USD Amount × Mid-Market Rate   (no markup)

Bank Charges GST      = calcBankCharges(Amount INR)

IRC Fee               = ₹500
GST on IRC            = 500 × 0.18 = ₹90
IRC Total             = ₹590

Toptal Wire Fee       = $10 × Mid-Market Rate

Total Fee             = Bank Charges GST + IRC Total + Toptal Wire Fee
Receiving Amount      = Amount INR − Total Fee
Effective Rate        = Receiving Amount ÷ USD Amount
```

---

## Final Ranking

After computing each platform's result, all six are sorted by **effective rate** in descending order:

```
Best    ▲  Highest effective rate  →  You receive the most ₹
          ...
Worst   ▼  Lowest effective rate   →  You receive the least ₹
```

The platform at the top is tagged as **best** (highlighted in green), and the one at the bottom is tagged as **worst** (highlighted in red). Everything in between is **default**.

> [!TIP]
> Rankings can change significantly based on the USD amount. For example, Skydo's flat $19 fee is expensive for small transfers but very competitive at higher amounts. Always compare at _your_ specific transfer amount.

---

## Summary Comparison Table

| Platform | Fee Model | GST | Extra Charges |
|---|---|---|---|
| **Skydo** | Tiered: $19 / $29 / 0.3% | 18% on fee | — |
| **Mulya** | Flat 1% | Included | — |
| **Infinity App** | Flat 0.5% | Included | — |
| **IDFC First Bank** | TT Rate spread + tiered svc charge | 18% on svc charge | — |
| **IOB** | TT Rate spread + tiered svc charge | 18% on svc charge | IRC ₹500 + GST, Toptal wire $10 |
| **ICICI Bank** (Toptal) | Mid-market, no markup + tiered svc charge | 18% on svc charge | IRC ₹500 + GST, Toptal wire $10 |

---

<p align="center">
  <a href="./README.md">← Back to README</a>
</p>
