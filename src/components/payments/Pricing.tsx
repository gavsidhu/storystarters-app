import { useRouter } from 'next/router';
import { Fragment, MouseEvent, MouseEventHandler, useState } from 'react';
import { HiCheck, HiMinus } from 'react-icons/hi2';

import useRegisterFlow from '@/hooks/useRegisterFlow';

import Button from '@/components/buttons/Button';

import { plans } from '@/constant/plans';

const tiers: {
  name: string;
  href: string;
  priceMonthly: number;
  description: string;
  priceId: string;
}[] = [
  {
    name: 'Starter',
    href: '#',
    priceMonthly: 15,
    description: 'Ideal for aspiring writers or those just starting out.',
    priceId: plans.tier1,
  },
  {
    name: 'Standard',
    href: '#',
    priceMonthly: 60,
    description:
      'Perfect for writers looking to take their writing to the next level.',
    priceId: plans.tier2,
  },
  {
    name: 'Professional',
    href: '#',
    priceMonthly: 100,
    description:
      'Tailored for professional writers who are looking to elevate their craft.',
    priceId: plans.tier3,
  },
];
const features: {
  name: string;
  tiers: {
    Starter?: boolean | string | undefined;
    Standard?: boolean | string | undefined;
    Professional?: boolean | string | undefined;
  };
}[] = [
  {
    name: 'AI generated words',
    tiers: {
      Starter: '20,000 words per month',
      Standard: '100,000 words per month',
      Professional: '200,000 words per month',
    },
  },
  {
    name: 'Plot generator',
    tiers: { Starter: true, Standard: true, Professional: true },
  },
  {
    name: 'Character creator',
    tiers: { Starter: true, Standard: true, Professional: true },
  },
  {
    name: 'Story outline generator',
    tiers: { Starter: true, Standard: true, Professional: true },
  },
  {
    name: '7-day money-back guarantee',
    tiers: { Starter: true, Standard: true, Professional: true },
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface Props {
  handlePlanSelect: MouseEventHandler<HTMLButtonElement>;
}

export default function Pricing({ handlePlanSelect }: Props) {
  const router = useRouter();
  const { setPriceId } = useRegisterFlow();
  const [loading, setLoading] = useState(false);
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    const id = (e.target as HTMLButtonElement).id;
    setPriceId(id);
    handlePlanSelect(e);
  };
  return (
    <div className='bg-white'>
      <div className='mt-8 max-w-3xl space-y-1 text-center lg:hidden'>
        {router.pathname === '/register' ? (
          <p className='text-gray-500'>
            Step <strong>1</strong> of <strong>3</strong>
          </p>
        ) : null}
        <h1 className='text-3xl'> Choose your plan</h1>
        <p className='text-sm'>
          You won't be charged until after your 7-day free trial. Upgrade,
          downgrade or cancel at anytime.
        </p>
      </div>
      <div className='mx-auto max-w-7xl bg-white py-16 sm:py-16 sm:px-6 lg:px-8'>
        {/* xs to lg */}
        <div className='mx-auto max-w-2xl space-y-16 lg:hidden'>
          {tiers.map((tier, tierIdx) => (
            <section key={tier.name}>
              <div className='mb-8 px-4'>
                <h2 className='text-lg font-medium leading-6 text-gray-900'>
                  {tier.name}
                </h2>
                <p className='mt-4'>
                  <span className='text-4xl font-bold tracking-tight text-gray-900'>
                    ${tier.priceMonthly}
                  </span>{' '}
                  <span className='text-base font-medium text-gray-500'>
                    /mo
                  </span>
                </p>
                {/* <p className='mt-4 text-sm text-gray-500'>{tier.description}</p> */}
                <Button
                  id={tier.priceId}
                  className='mt-6 block w-full rounded-md bg-primary-500 py-2 text-center text-sm font-semibold text-white hover:bg-primary-300'
                  onClick={onClick}
                  isLoading={loading}
                >
                  Try {tier.name} for free
                </Button>
              </div>
              <table className='w-full'>
                <caption className='border-t border-gray-200 bg-gray-50 py-3 px-4 text-left text-sm font-medium text-gray-900'>
                  Features
                </caption>
                <thead>
                  <tr>
                    <th className='sr-only' scope='col'>
                      Feature
                    </th>
                    <th className='sr-only' scope='col'>
                      Included
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {features.map((feature) => (
                    <tr key={feature.name} className='border-t border-gray-200'>
                      <th
                        className='py-5 px-4 text-left text-sm font-normal text-gray-500'
                        scope='row'
                      >
                        {feature.name}
                      </th>
                      <td className='py-5 pr-4'>
                        {typeof feature.tiers[tier.name as keyof object] ===
                        'string' ? (
                          <span className='block text-right text-sm text-gray-700'>
                            {feature.tiers[tier.name as keyof object]}
                          </span>
                        ) : (
                          <>
                            {feature.tiers[tier.name as keyof object] ===
                            true ? (
                              <HiCheck
                                className='ml-auto h-5 w-5 text-primary-500'
                                aria-hidden='true'
                              />
                            ) : (
                              <HiMinus
                                className='ml-auto h-5 w-5 text-gray-400'
                                aria-hidden='true'
                              />
                            )}

                            <span className='sr-only'>
                              {feature.tiers[tier.name as keyof object] === true
                                ? 'Yes'
                                : 'No'}
                            </span>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div
                className={classNames(
                  tierIdx < tiers.length - 1 ? 'border-b py-5' : 'pt-5',
                  'border-t border-gray-200 px-4'
                )}
              >
                <Button
                  id={tier.priceId}
                  className='block w-full rounded-md bg-primary-500 py-2 text-center text-sm font-semibold text-white hover:bg-primary-300'
                  onClick={onClick}
                  isLoading={loading}
                >
                  Try {tier.name} for free
                </Button>
              </div>
            </section>
          ))}
        </div>

        {/* lg+ */}
        <div className='hidden lg:block'>
          <div className='max-w-3xl space-y-1 text-left'>
            {router.pathname === '/register' ? (
              <p className='text-gray-500'>
                Step <strong>1</strong> of <strong>3</strong>
              </p>
            ) : null}
            <h1 className='text-3xl'> Choose your plan</h1>
            <p className='text-sm'>
              You won't be charged until after your 7-day free trial. Upgrade,
              downgrade or cancel at anytime.
            </p>
          </div>
          <table className='mt-16 h-px w-full table-fixed'>
            <caption className='sr-only'>Pricing plan comparison</caption>
            <thead>
              <tr>
                <th
                  className='px-6 pb-4 text-left text-sm font-medium text-gray-900'
                  scope='col'
                >
                  <span className='sr-only'>Feature by</span>
                  <span>Plans</span>
                </th>
                {tiers.map((tier) => (
                  <th
                    key={tier.name}
                    className='w-1/4 px-6 pb-4 text-left text-lg font-medium leading-6 text-gray-900'
                    scope='col'
                  >
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 border-t border-gray-200'>
              <tr>
                <th
                  className='py-8 px-6 text-left align-top text-sm font-medium text-gray-900'
                  scope='row'
                >
                  Pricing
                </th>
                {tiers.map((tier) => (
                  <td key={tier.name} className='h-full py-8 px-6 align-top'>
                    <div className='relative table h-full'>
                      <p>
                        <span className='text-4xl font-bold tracking-tight text-gray-900'>
                          ${tier.priceMonthly}
                        </span>{' '}
                        <span className='text-base font-medium text-gray-500'>
                          /mo
                        </span>
                      </p>
                      <p className='mt-4 mb-16 text-sm text-gray-500'>
                        {tier.description}
                      </p>
                      <Button
                        id={tier.priceId}
                        className='5 absolute bottom-0 block w-full flex-grow rounded-md bg-primary-500 py-2 text-center text-sm font-semibold text-white hover:bg-primary-300'
                        onClick={onClick}
                        isLoading={loading}
                      >
                        Try {tier.name} for free
                      </Button>
                    </div>
                  </td>
                ))}
              </tr>

              <Fragment>
                <tr>
                  <th
                    className='bg-gray-50 py-3 pl-6 text-left text-sm font-medium text-gray-900'
                    colSpan={4}
                    scope='colgroup'
                  >
                    Features
                  </th>
                </tr>
                {features.map((feature) => (
                  <tr key={feature.name}>
                    <th
                      className='py-5 px-6 text-left text-sm font-normal text-gray-500'
                      scope='row'
                    >
                      {feature.name}
                    </th>
                    {tiers.map((tier) => (
                      <td key={tier.name} className='py-5 px-6'>
                        {typeof feature.tiers[tier.name as keyof object] ===
                        'string' ? (
                          <span className='block text-sm text-gray-700'>
                            {feature.tiers[tier.name as keyof object]}
                          </span>
                        ) : (
                          <>
                            {feature.tiers[tier.name as keyof object] ===
                            true ? (
                              <HiCheck
                                className='h-5 w-5 text-primary-500'
                                aria-hidden='true'
                              />
                            ) : (
                              <HiMinus
                                className='h-5 w-5 text-gray-400'
                                aria-hidden='true'
                              />
                            )}

                            <span className='sr-only'>
                              {feature.tiers[tier.name as keyof object] === true
                                ? 'Included'
                                : 'Not included'}{' '}
                              in {tier.name}
                            </span>
                          </>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            </tbody>
            <tfoot>
              <tr className='border-t border-gray-200'>
                <th className='sr-only' scope='row'>
                  Choose your plan
                </th>
                {tiers.map((tier) => (
                  <td key={tier.name} className='px-6 pt-5'>
                    <Button
                      id={tier.priceId}
                      className='block w-full rounded-md bg-primary-500 py-2 text-center text-sm font-semibold text-white hover:bg-primary-300'
                      onClick={onClick}
                      isLoading={loading}
                    >
                      Try {tier.name} for free
                    </Button>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
