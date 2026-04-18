import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No data found',
  description = 'Nothing to display here yet.',
  actionLabel,
  onAction,
}) => (
  <div className='flex flex-col items-center justify-center py-20 px-4 text-center'>
    <div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-50 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center mb-6 animate-float'>
      <Icon size={40} className='text-primary-600 dark:text-primary-400' />
    </div>
    <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>{title}</h3>
    <p className='text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6'>{description}</p>
    {actionLabel && onAction && (
      <Button variant='primary' onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
