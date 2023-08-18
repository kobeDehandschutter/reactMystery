import { fireEvent, render, screen, within } from '@testing-library/react';
import Alert from './Alert';
import { ComponentPropsWithoutRef } from 'react';

type AlertProps = ComponentPropsWithoutRef<typeof Alert>;

it('renders an alert by default', () => {
  render(
    <Alert>
      <div data-testid="child" />
    </Alert>,
  );

  const alert = screen.getByRole('alert');
  expect(alert).toHaveClass('alert alert-warning');

  // it renders children
  within(alert).getByTestId('child');

  expect(within(alert).queryByRole('heading')).not.toBeInTheDocument();
});

it.each<AlertProps['variant']>(['info', 'warning', 'danger'])('renders as variant: %s', (variant) => {
  render(<Alert variant={variant}>My message</Alert>);

  const alert = screen.getByRole('alert');
  expect(alert).toHaveClass(`alert alert-${variant}`);
});

it('supports a heading', () => {
  render(<Alert heading={<div data-testid="headingChild" />}>You have mail</Alert>);

  const alert = screen.getByRole('alert');

  const header = within(alert).getByRole('heading');
  expect(header).toHaveProperty('tagName', 'H4');
  expect(header).toHaveClass('alert-heading');

  within(header).getByTestId('headingChild');
});

it('supports extra classes', () => {
  render(<Alert className="extra-class">Message from the darkside</Alert>);

  const alert = screen.getByRole('alert');
  expect(alert).toHaveClass('alert alert-warning extra-class');
});

it('renders as dismissable if onDismiss is passed', () => {
  const onDismiss = jest.fn();

  render(<Alert onDismiss={onDismiss}>I am dismissable</Alert>);
  const alert = screen.getByRole('alert');

  // Verify addition of class
  expect(alert).toHaveClass('alert', 'alert-warning', 'alert-dismissible');

  // Verify close button by aria-label
  const closeButton = within(alert).getByLabelText('Close', { selector: 'button' });
  expect(closeButton).toHaveClass('btn-close');

  // Verify dismissable behavior
  fireEvent.click(closeButton); //⚡ Click the button
  expect(onDismiss).toHaveBeenCalledTimes(1);
});
