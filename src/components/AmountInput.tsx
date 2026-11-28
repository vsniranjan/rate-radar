"use client";
import { useState, useTransition } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useRouter } from "next/navigation";

export function AmountInput({
  amtParam,
  wireFeeParam,
}: {
  amtParam: string;
  wireFeeParam: string;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(amtParam);
  const [wireFee, setWireFee] = useState(wireFeeParam);
  const [isPending, startTransition] = useTransition();

  const handleCompare = () => {
    const parsedWireFee = Number(wireFee);
    if (
      amount &&
      Number(amount) > 100 &&
      wireFee !== "" &&
      Number.isFinite(parsedWireFee) &&
      parsedWireFee >= 0
    ) {
      startTransition(() => {
        const params = new URLSearchParams({ amt: amount, wireFee });
        router.push(`/?${params.toString()}`);
      });
    }
  };

  const isAmountInvalid = amount && Number(amount) > 0 && Number(amount) < 100;
  const isWireFeeInvalid =
    wireFee === "" || !Number.isFinite(Number(wireFee)) || Number(wireFee) < 0;

  return (
    <Field className='mt-16'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4'>
        <div>
          <FieldLabel htmlFor='amount-usd' className='text-sm text-gray-500'>
            Amount you're receiving
          </FieldLabel>
          <InputGroup className={`w-full max-w-64 h-14 bg-white has-[[data-slot=input-group-control]:focus-visible]:border-blue-600 has-[[data-slot=input-group-control]:focus-visible]:ring-blue-600/30 ${isAmountInvalid ? 'border-red-500' : 'border-blue-800'}`}>
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
        </div>

        <div>
          <FieldLabel htmlFor='wire-fee' className='text-sm text-gray-500'>
            Toptal wire fee
          </FieldLabel>
          <InputGroup className={`w-full max-w-48 h-14 bg-white has-[[data-slot=input-group-control]:focus-visible]:border-blue-600 has-[[data-slot=input-group-control]:focus-visible]:ring-blue-600/30 ${isWireFeeInvalid ? 'border-red-500' : 'border-blue-800'}`}>
            <InputGroupInput
              id='wire-fee'
              type='number'
              min={0}
              step='any'
              value={wireFee}
              onChange={(e) => setWireFee(e.target.value)}
              className='text-primary font-medium text-2xl!'
              placeholder='20'
            />
            <InputGroupAddon className='gap-3 text-primary ml-2'>
              <span className='text-xs font-medium'>USD</span>
              <div className='h-6 w-px bg-primary' />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <button
          onClick={handleCompare}
          disabled={!amount || Number(amount) < 100 || isWireFeeInvalid || isPending}
          className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
        >
          {isPending ? "Calculating…" : "Compare Rates"}
        </button>
      </div>

      {isAmountInvalid && (
        <p className='text-sm text-red-600 mt-2'>
          Minimum amount is $100 USD
        </p>
      )}
    </Field>
  );
}
