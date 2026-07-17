import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

const SIZES = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

/**
 * Accessible modal built on Radix Dialog: focus trap, Esc/overlay close,
 * scroll lock, and screen-reader labeling come from the primitive.
 */
export const Modal = ({ isOpen, onClose, title, children, size = 'lg' }) => (
  <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose?.(); }}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-sidebar/50 backdrop-blur-sm animate-overlay-show" />
      <Dialog.Content
        aria-describedby={undefined}
        className={`fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)]
          ${SIZES[size] || SIZES.lg} max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl
          border border-border-subtle animate-content-show focus:outline-none`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle shrink-0">
          <Dialog.Title className="text-lg font-bold text-sidebar tracking-tight">{title}</Dialog.Title>
          <Dialog.Close asChild>
            <button
              aria-label="Close"
              className="p-2 -mr-2 text-gray-400 rounded-lg transition-colors hover:text-primary hover:bg-primary/10
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <X size={18} />
            </button>
          </Dialog.Close>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
