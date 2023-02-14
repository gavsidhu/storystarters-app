import React, { useContext } from 'react';

import useSubscription from '@/hooks/useSubscription';

import Button from '@/components/buttons/Button';

import { plans } from '@/constant/plans';
import { AlertContext } from '@/context/AlertState';

const SidebarCard = () => {
  const { subscription } = useSubscription();
  const alertContext = useContext(AlertContext);

  const getPlan = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'Free';
      case plans.tier1:
        return 'Starter';
      case plans.tier2:
        return 'Standard';
      case plans.tier3:
        return 'Professional';
      default:
        return '';
    }
  };

  const calculateCost = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'No cost $0/month';
      case plans.tier1:
        return '$15/month';
      case plans.tier2:
        return '$60/month';
      case plans.tier3:
        return '$100/month';
      default:
        return '';
    }
  };
  return (
    <div id='sidebar-card' className='rounded-lg border-t p-2'>
      <div className='flex flex-row items-center justify-between'>
        <div>
          <div className='mb-3 flex items-center'>
            <span className='mr-2 rounded bg-primary-500 px-2.5 py-0.5 text-sm font-semibold text-white'>
              {getPlan(subscription?.plan as string)}
            </span>
          </div>
          <p className='mb-3 text-xs text-black'>
            {calculateCost(subscription?.plan as string)}
          </p>
        </div>
        <div>
          <Button
            onClick={() => alertContext.setUpgradeModal()}
            variant='ghost'
            className='text-sm text-black hover:bg-gray-200'
          >
            {subscription?.plan != plans.tier3 ? 'Upgrade' : 'Modify'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidebarCard;
