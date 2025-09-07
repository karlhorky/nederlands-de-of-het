'use client';

import type { ReactElement } from 'react';
import { cloneElement, useState } from 'react';

interface CollapsibleProps {
  trigger: ReactElement<any>;
  children: React.ReactNode;
}

export default function Collapsible({ trigger, children }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const triggerWithProps = cloneElement(trigger, {
    ...trigger.props,
    onClick: () => setIsOpen(!isOpen),
    'aria-expanded': isOpen,
  });

  return (
    <>
      {triggerWithProps}
      {isOpen && children}
    </>
  );
}
