import { fireEvent, render, screen, within } from '@testing-library/react';
import Button from './Button';
import { ComponentPropsWithoutRef } from 'react';

type ButtonProps = ComponentPropsWithoutRef<typeof Button>;

it('renders the button by default', () => {
  render(
    <Button type="button">
      <div data-testid="child" />{' '}
    </Button>,
  );

  const button = screen.getByRole('button');
  expect(button).toHaveProperty('type', 'button');

  expect(button).toHaveClass('btn btn-secondary', { exact: true });

  within(button).getByTestId('child');

  expect(button).toBeEnabled();
  expect(button).not.toHaveAttribute('aria-disabled');
});

it.each<ButtonProps['type']>(['button', 'reset', 'submit'])('renders as type: %s', (type) => {
  render(<Button type={type}></Button>);

  const button = screen.getByRole('button');
  expect(button).toHaveProperty('type', type);
});

it.each<ButtonProps['variant']>(['primary', 'secondary', 'success', 'danger'])('renders as variant: %s', (variant) => {
  render(
    <Button type="button" variant={variant}>
      My message
    </Button>,
  );

  const button = screen.getByRole('button');
  expect(button).toHaveClass(`btn btn-${variant}`);
});

it('renders outlined', () => {
  render(
    <Button type="button" variant="primary" outlined>
      My message
    </Button>,
  );

  const button = screen.getByRole('button');
  expect(button).toHaveClass('btn btn-outline-primary', { exact: true });
});

it.each<[ButtonProps['size'], string]>([
  ['small', 'sm'],
  ['large', 'lg'],
])('renders as variant: %s', (size, suffix) => {
  render(
    <Button type="button" size={size}>
      My message
    </Button>,
  );

  const button = screen.getByRole('button');
  expect(button).toHaveClass(`btn-${suffix}`);
});

it('can be disabled', () => {
  render(
    <Button type="button" disabled>
      Click me
    </Button>,
  );

  const button = screen.getByRole('button');
  expect(button).toBeDisabled();
  expect(button).toHaveAttribute('aria-disabled', 'true');
});

it('is clickable', () => {
  const onClick = jest.fn();

  render(
    <Button type="button" onClick={onClick}>
      I am dismissable
    </Button>,
  );

  const button = screen.getByRole('button');
  fireEvent.click(button);

  expect(onClick).toHaveBeenCalledTimes(1);
});

it('supports extra classes', () => {
  render(
    <Button className="extra-class" type="button">
      Message from the darkside
    </Button>,
  );

  const button = screen.getByRole('button');
  expect(button).toHaveClass('btn extra-class');
});
