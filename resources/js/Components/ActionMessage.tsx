import { Transition } from '@mantine/core';
import React, { PropsWithChildren } from 'react';

interface Props {
  on: boolean;
  className?: string;
}

export default function ActionMessage({
  on,
  className,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className={className}>
      <Transition
        mounted={on}
        transition="fade"
        duration={1000}
        timingFunction="ease-in"
      >
        {styles => (
          <div
            style={styles}
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            {children}
          </div>
        )}
      </Transition>
    </div>
  );
}
