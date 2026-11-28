import ComparisonCard from "./ComparisonCard";
import { Accordion } from "@/components/ui/accordion";
import { compareAllRates } from "@/lib/compare";

type Props = {
  amtUSD: number;
  wireFeeUSD: number;
};

const ComparisonField = async ({ amtUSD, wireFeeUSD }: Props) => {
  const content = await compareAllRates(amtUSD, wireFeeUSD);

  return (
    <>
      <h2 className='text-muted text-sm mt-14 mb-2 pl-2'>Comparison Results</h2>
      <p className='text-xs text-gray-500 pl-2 mb-4'>
        {content.marketRate
          ? `Mid-market rate: ₹${content.marketRate.rate} / USD | Last updated ${content.marketRate.date}`
          : "Could not fetch mid-market rates"}
      </p>

      <Accordion type='multiple' className='w-full max-w-2xl gap-4'>
        {content.data.map((dataPoint) => (
          <ComparisonCard key={dataPoint.name} data={dataPoint} />
        ))}
      </Accordion>
    </>
  );
};

export default ComparisonField;
