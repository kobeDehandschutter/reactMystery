import clsx from 'clsx';
import React, { FC } from 'react';

const WARNING = 'warning';
const INFO = 'info';
const LIGHT = 'light';

interface BadgeProps {
  children: React.ReactNode;
  pill?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | typeof WARNING | typeof INFO | typeof LIGHT | 'dark';
}

const BASE_CLASS_NAME = 'badge';

export const Badge: FC<BadgeProps> = ({ children, pill, variant = 'secondary' }) => (
  <span
    className={clsx(
      BASE_CLASS_NAME,
      pill && 'rounded-pill',
      `bg-${variant}`,
      [WARNING, INFO, LIGHT].includes(variant) && 'text-dark',
    )}
  >
    {children}
  </span>
);
