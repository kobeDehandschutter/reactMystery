import clsx from 'clsx';
import { FC, ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
  variant?: 'info' | 'warning' | 'danger';
  heading?: ReactNode;
  className?: string;
  onDismiss?: () => void;
}

const BOOTSTRAP_PREFIX = 'alert';

const Alert: FC<AlertProps> = ({ children, variant = 'warning', heading, className, onDismiss }) => (
  <div
    role="alert"
    className={clsx(
      BOOTSTRAP_PREFIX,
      `${BOOTSTRAP_PREFIX}-${variant}`,
      className,
      onDismiss && `${BOOTSTRAP_PREFIX}-dismissible`,
    )}
  >
    {heading && <h4 className={`${BOOTSTRAP_PREFIX}-heading`}>{heading}</h4>}
    {children}
    {onDismiss && <button type="button" className="btn-close" aria-label="Close" onClick={onDismiss}></button>}
  </div>
);

export default Alert;
