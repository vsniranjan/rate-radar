"use client";
import { useState, useEffect, useTransition } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useRouter } from "next/navigation";

export function AmountInput({ amtParam }: { amtParam: string }) {
  const router = useRouter();
  const [amount, setAmount] = useState(amtParam);
  const [isPending, startTransition] = useTransition();

  const handleCompare = () => {
    if (amount && Number(amount) > 100) {
      startTransition(() => {
        router.push(`/?amt=${amount}`);
      });
    }
  };

  useEffect(() => {
    setAmount(amtParam);
  }, [amtParam]);

  return (
    <Field className='mt-16'>
      <FieldLabel htmlFor='amount-usd' className='text-sm text-gray-500'>
        Enter the amount you're receiving
      </FieldLabel>

      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
        <InputGroup className='max-w-96 h-14 border-blue-800 bg-white has-[[data-slot=input-group-control]:focus-visible]:border-blue-600 has-[[data-slot=input-group-control]:focus-visible]:ring-blue-600/30'>
          <InputGroupInput
            id='amount-usd'
            type='number'
            min={100}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className='text-primary font-medium text-2xl!'
            placeholder='0'
          />

          <InputGroupAddon className='gap-3 text-primary ml-2'>
            <span className='text-xs font-medium'>USD</span>
            <div className='h-6 w-px bg-primary' />
          </InputGroupAddon>
        </InputGroup>

        <button
          onClick={handleCompare}
          disabled={!amount || Number(amount) < 100 || isPending}
          className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
        >
          {isPending ? "Calculating…" : "Compare Rates"}
        </button>
      </div>
    </Field>
  );
}
