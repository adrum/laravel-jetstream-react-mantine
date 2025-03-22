import { Modal, ModalProps } from '@mantine/core';
import React, { PropsWithChildren } from 'react';

DialogModal.Content = function DialogModalContent({
  children,
}: PropsWithChildren) {
  return (
    <div className="px-6">
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        {children}
      </div>
    </div>
  );
};

DialogModal.Footer = function DialogModalFooter({
  children,
}: PropsWithChildren<Record<string, unknown>>) {
  return <div className="px-6 py-4 text-right">{children}</div>;
};

export default function DialogModal({
  children,
  ...modalProps
}: PropsWithChildren<ModalProps>) {
  return (
    <Modal centered {...modalProps}>
      {children}
    </Modal>
  );
}
