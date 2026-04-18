import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  const iconMap = {
    danger: { Icon: Trash2, bg: 'bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400' },
    warning: { Icon: AlertTriangle, bg: 'bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400' },
    info: { Icon: AlertCircle, bg: 'bg-info-100 dark:bg-info-900/30 text-info-600 dark:text-info-400' },
    success: { Icon: CheckCircle2, bg: 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400' },
  };

  const { Icon, bg } = iconMap[variant] || iconMap.danger;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} size='sm'>
      <div className='flex flex-col items-center text-center py-6'>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${bg}`}>
          <Icon size={28} />
        </div>
        <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-2'>{title}</h3>
        <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>{message}</p>
        <div className='flex gap-3 w-full'>
          <Button variant='secondary' fullWidth onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : variant === 'success' ? 'success' : 'primary'}
            fullWidth
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
