import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Draggable from 'react-draggable';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface DraggableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  width?: string;
  className?: string;
  customHeader?: React.ReactNode;
  hideDefaultHeader?: boolean;
}

export function DraggableModal({
  isOpen,
  onClose,
  title,
  children,
  width = 'max-w-2xl',
  className,
  customHeader,
  hideDefaultHeader = false
}: DraggableModalProps) {
  const [mounted, setMounted] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1f2a44]/80 backdrop-blur-md p-4"
        >
          <Draggable 
            nodeRef={nodeRef} 
            handle=".modal-handle" 
            cancel="button, input, select, textarea, [role='button']"
          >
            <motion.div 
              ref={nodeRef}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={clsx(
                "bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col w-full max-h-[90vh]",
                width,
                className
              )}
            >
              {/* Header / Handle */}
              {!hideDefaultHeader && (
                <div className="modal-handle cursor-move w-full shrink-0">
                  {customHeader ? customHeader : (
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                      {typeof title === 'string' ? (
                        <h3 className="text-sm font-black text-[#111f42] uppercase tracking-widest">
                          {title}
                        </h3>
                      ) : (
                        title
                      )}
                      <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-hidden flex flex-col">
                {children}
              </div>
            </motion.div>
          </Draggable>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}


