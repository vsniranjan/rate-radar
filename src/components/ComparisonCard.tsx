"use client";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Variant = "best" | "default" | "worst";

interface CardPropsOk {
  status: "ok";
  name: string;
  note?: string;
  receivingAmtINR: number;
  totalFee: number;
  effectiveRate: number;
  feesExceedAmount?: boolean;
  type: Variant;
  breakdown: {
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
}

interface CardPropsError {
  status: "error";
  name: string;
}

export type ComparisonCardData = CardPropsOk | CardPropsError;

interface ComparisonCardProps {
  data: ComparisonCardData;
}

export function ComparisonCard({ data }: ComparisonCardProps) {
  if (data.status === "error") {
    return (
      <AccordionItem
        value={data.name}
        disabled
        className='border-[1.3px] rounded-xl overflow-hidden border-brand-red/30 bg-brand-red/5 opacity-70'
      >
        <AccordionTrigger className='px-5 gap-4 flex pointer-events-none **:data-[slot=accordion-trigger-icon]:hidden'>
          <span className='flex-1 text-primary text-xl font-semibold'>
            {data.name}
          </span>
          <span className='flex-1 text-center text-sm font-medium text-brand-red'>
            Rates temporarily unavailable
          </span>
          <div className='flex-1 flex flex-col items-end'>
            <span className='text-muted text-xs'>Error</span>
          </div>
        </AccordionTrigger>
      </AccordionItem>
    );
  }
  const borderColor = {
    best: "border-brand-green",
    worst: "border-brand-red",
    default: "border-primary/50",
  };

  const triggerBg = {
    best: "bg-[rgba(51,229,128,0.3)]",
    worst: "bg-[rgba(255,89,89,0.3)]",
    default: "bg-[#f0f4ff]",
  };

  const recvColor = {
    best: "text-brand-green",
    worst: "text-brand-red",
    default: "text-primary",
  };
  return (
    <AccordionItem
      value={data.name}
      className={`border-[1.3px] rounded-xl overflow-hidden ${borderColor[data.type]} ${triggerBg[data.type]}`}
    >
      <AccordionTrigger className={`px-5 gap-4 flex`}>
        <span className='flex-1'>
          <span className='block text-primary text-xl font-semibold'>
            {data.name}
          </span>
          {data.note && (
            <span className='block text-muted text-[11px] font-normal mt-0.5'>
              {data.note}
            </span>
          )}
        </span>

        {data.feesExceedAmount ? (
          <span className='flex-1 text-center text-lg font-bold text-brand-red'>
            Fees exceed amount
          </span>
        ) : (
          <span
            className={`flex-1 text-center text-2xl font-bold ${recvColor[data.type]}`}
          >
            ₹
            {data.receivingAmtINR.toLocaleString("en-IN", {
              maximumFractionDigits: 0,
            })}
          </span>
        )}

        <div className='flex-1 flex flex-col items-end'>
          <span className='text-brand-red text-lg'>
            −₹
            {data.totalFee.toLocaleString("en-IN", {
              maximumFractionDigits: 0,
            })}
          </span>
          <span className='text-muted text-xs'>
            ₹
            {data.effectiveRate.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
            / USD
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className='px-5 pb-4 bg-white border-t-[1.3px] border-[#001836]'>
        <div className='text-[11px] font-medium text-[#8c97b8] tracking-widest uppercase mb-3 pt-4'>
          Fee breakdown
        </div>

        {data.breakdown.conversion && (
          <div className='flex justify-between items-center py-2 border-b border-black/10'>
            <div>
              <p className='text-[13px] text-[#141f59] m-0!'>
                {data.breakdown.conversion.description}
              </p>
              <p className='text-[12px] text-muted mt-0.5'>
                {data.breakdown.conversion.ttBuyRate &&
                  `Rate: ₹${data.breakdown.conversion.ttBuyRate} / USD`}
              </p>
            </div>
            <span className='text-[14px] font-medium text-[#141f59]'>
              ₹
              {data.breakdown.conversion.amount.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        )}

        {data.breakdown.platformFee && (
          <div className='flex justify-between items-center py-2 border-b border-black/10'>
            <p className='text-[13px] text-[#141f59] m-0!'>
              {data.breakdown.platformFee.description}
            </p>

            <span className='text-[14px] font-medium  text-brand-red'>
              -₹
              {data.breakdown.platformFee.amount.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        )}

        {data.breakdown.additionalFees &&
          data.breakdown.additionalFees.map((fee, index) => (
            <div
              key={index}
              className='flex justify-between items-center py-2 border-b border-black/10'
            >
              <p className='text-[13px] text-[#141f59] m-0!'>
                {fee.description}
              </p>

              <span className='text-[14px] font-medium text-brand-red'>
                -₹
                {fee.amount.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          ))}

        <div className='flex justify-between items-center pt-3 pb-1'>
          <span className='text-[14px] font-semibold text-[#141f59]'>
            You receive
          </span>
          <span className='text-[17px] font-bold text-[#141f59]'>
            ₹
            {data.receivingAmtINR.toLocaleString("en-IN", {
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-[12px] text-[#8c97b8]'>Effective rate</span>
          <span className='text-[12px] text-[#8c97b8]'>
            ₹{data.effectiveRate} / USD
          </span>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default ComparisonCard;
