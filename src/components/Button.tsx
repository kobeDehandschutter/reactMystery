import clsx from 'clsx';
import { FC, ReactNode } from 'react';

interface ButtonProps {
  type: 'button' | 'submit' | 'reset';
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  outlined?: boolean;
  size?: 'small' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const BOOTSTRAP_PREFIX = 'btn';

const sizeMap = {
  small: 'sm',
  large: 'lg',
} as const satisfies Record<NonNullable<ButtonProps['size']>, string>;

const Button: FC<ButtonProps> = ({
  type,
  children,
  variant = 'secondary',
  outlined,
  size,
  disabled,
  onClick,
  className,
}) => {
  const sizeSuffix = size && sizeMap[size];

  return (
    <button
      type={type}
      className={clsx(
        BOOTSTRAP_PREFIX,
        `${BOOTSTRAP_PREFIX}${outlined ? '-outline' : ''}-${variant}`,
        sizeSuffix && `${BOOTSTRAP_PREFIX}-${sizeSuffix}`,
        className,
      )}
      disabled={disabled}
      aria-disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
