import React from 'react';
import Modal from'./Modal';
import Button from'./Button';
import{AlertTriangle,Trash2}from'lucide-react';
const ConfirmDialog=({isOpen,onConfirm,onCancel,title='Are you sure?',message='This action cannot be undone.',confirmText='Confirm',cancelText='Cancel',variant='danger',loading=false})=>{
  const Icon=variant==='danger'?Trash2:AlertTriangle;
  const bg=variant==='danger'?'bg-danger-100 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400':'bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400';
  return(
    <Modal isOpen={isOpen} onClose={onCancel} size='sm'>
      <div className='flex flex-col items-center text-center py-4'>
        <div className={'w-12 h-12 rounded-full flex items-center justify-center mb-4 '+bg}><Icon size={24}/></div>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>{title}</h3>
        <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>{message}</p>
        <div className='flex gap-3 w-full'>
          <Button variant='secondary' fullWidth onClick={onCancel} disabled={loading}>{cancelText}</Button>
          <Button variant={variant==='danger'?'danger':'primary'} fullWidth onClick={onConfirm} loading={loading}>{confirmText}</Button>
        </div>
      </div>
    </Modal>
  );
};
export default ConfirmDialog;
