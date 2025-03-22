import React from 'react';
import { Button } from './button';

export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        {children}
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>
  );
}