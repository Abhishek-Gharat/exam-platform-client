import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-5xl',
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
}) => {
  const onEsc = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', onEsc);

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen, onEsc]);

  if (!isOpen) return null;

  return (
    <>
      {/* ★ Full-screen overlay — separate from modal container */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md transition-opacity"
        onClick={closeOnOverlay ? onClose : undefined}
      />

      {/* ★ Modal container — centered on top of overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <div
          className={`
            w-full ${sizes[size] || sizes.md}
            bg-white dark:bg-surface-800
            rounded-2xl shadow-2xl
            border border-gray-200 dark:border-gray-700
            max-h-[85vh] flex flex-col
            animate-scale-in
            pointer-events-auto
          `}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2 flex-shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;