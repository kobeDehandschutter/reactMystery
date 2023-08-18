import { ComponentPropsWithoutRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserDetailForm from './UserDetailForm';

afterEach(() => {
  jest.clearAllMocks();
});

const FIRSTNAME_LABEL = 'First name';
const LASTNAME_LABEL = 'Last name';
const EMAIL_LABEL = 'Email';
const AGE_LABEL = 'Age';
const SAVE_LABEL = 'Save';

type UserDetailFormProps = ComponentPropsWithoutRef<typeof UserDetailForm>;

const renderForm = ({ onSubmit = jest.fn() }: Partial<UserDetailFormProps> = {}) =>
  render(<UserDetailForm onSubmit={onSubmit} />);

const fill = async ({
  firstName,
  lastName,
  email,
  age,
}: Partial<{ firstName: string; lastName: string; email: string; age: string }>) => {
  if (firstName) await userEvent.type(screen.getByLabelText(FIRSTNAME_LABEL), firstName);
  if (lastName) await userEvent.type(screen.getByLabelText(LASTNAME_LABEL), lastName);
  if (email) await userEvent.type(screen.getByLabelText(EMAIL_LABEL), email);
  if (age) await userEvent.type(screen.getByLabelText(AGE_LABEL), age);
};

const buildValidFormValues = () => ({ firstName: 'John', lastName: 'Doe', email: 'john.doe@gmail.com' });

it('renders the form by default', () => {
  renderForm();

  const form = screen.getByRole('form');
  expect(form).toHaveAttribute('novalidate');

  const firstnameInput = within(form).getByLabelText(FIRSTNAME_LABEL);
  expect(firstnameInput).toHaveValue('');
  expect(firstnameInput).toHaveFocus();
  expect(firstnameInput).toBeValid();

  const lastnameInput = within(form).getByLabelText(LASTNAME_LABEL);
  expect(lastnameInput).toHaveValue('');
  expect(lastnameInput).toBeValid();

  const emailInput = within(form).getByLabelText(EMAIL_LABEL);
  expect(emailInput).toHaveValue('');
  expect(emailInput).toBeValid();

  const ageInput = within(form).getByLabelText(AGE_LABEL);
  expect(ageInput).toHaveValue(null);
  expect(ageInput).toBeValid();

  const submitButton = within(form).getByRole('button', { name: SAVE_LABEL });
  expect(submitButton).toHaveAttribute('type', 'submit');
  expect(submitButton).toHaveClass('btn-primary');
});

it('calls onSubmit with minimum required fields', async () => {
  const onSubmit = jest.fn();

  renderForm({ onSubmit });

  const formValues = buildValidFormValues();
  await fill(formValues);

  await userEvent.click(screen.getByRole('button', { name: SAVE_LABEL }));

  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenCalledWith(formValues);
});

it('calls onSubmit with all fields', async () => {
  const onSubmit = jest.fn();

  renderForm({ onSubmit });

  const formValues = { ...buildValidFormValues(), age: '30' };
  await fill(formValues);

  await userEvent.click(screen.getByRole('button', { name: SAVE_LABEL }));

  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenCalledWith({ ...formValues, age: 30 });
});

describe('validation', () => {
  it('firstName renders as invalid when not filled in', async () => {
    const onSubmit = jest.fn();

    renderForm({ onSubmit });

    const { firstName, ...valuesWithoutFirstName } = buildValidFormValues();
    await fill(valuesWithoutFirstName);

    await userEvent.click(screen.getByRole('button', { name: SAVE_LABEL }));

    const firstNameInput = screen.getByLabelText(FIRSTNAME_LABEL);
    expect(firstNameInput).toBeInvalid();
    expect(firstNameInput).toHaveAccessibleDescription('Please enter a firstname.');

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('lastName renders as invalid when not filled in', async () => {
    const onSubmit = jest.fn();

    renderForm({ onSubmit });

    const { lastName, ...valuesWithoutLastName } = buildValidFormValues();
    await fill(valuesWithoutLastName);

    await userEvent.click(screen.getByRole('button', { name: SAVE_LABEL }));

    const lastNameInput = screen.getByLabelText(LASTNAME_LABEL);
    expect(lastNameInput).toBeInvalid();
    expect(lastNameInput).toHaveAccessibleDescription('Please enter a lastname.');

    expect(onSubmit).not.toHaveBeenCalled();
  });

  describe('email', () => {
    it('renders as invalid when not filled in', async () => {
      const onSubmit = jest.fn();

      renderForm({ onSubmit });

      const { email, ...valuesWithoutEmail } = buildValidFormValues();
      await fill(valuesWithoutEmail);

      await userEvent.click(screen.getByRole('button', { name: SAVE_LABEL }));

      const emailInput = screen.getByLabelText(EMAIL_LABEL);
      expect(emailInput).toBeInvalid();
      expect(emailInput).toHaveAccessibleDescription('Please enter an email.');

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('renders as invalid when not a valid email', async () => {
      const onSubmit = jest.fn();

      renderForm({ onSubmit });

      const formValues = { ...buildValidFormValues(), email: 'not an email' };
      await fill(formValues);

      await userEvent.click(screen.getByRole('button', { name: SAVE_LABEL }));

      const emailInput = screen.getByLabelText(EMAIL_LABEL);
      expect(emailInput).toBeInvalid();
      expect(emailInput).toHaveAccessibleDescription('Please provide a valid email.');

      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('age', () => {
    it('it renders as invalid when a decimal', async () => {
      const onSubmit = jest.fn();

      renderForm({ onSubmit });

      const formValues = { ...buildValidFormValues, age: '1.34' };
      await fill(formValues);

      await userEvent.click(screen.getByRole('button', { name: SAVE_LABEL }));

      const ageInput = screen.getByLabelText(AGE_LABEL);
      expect(ageInput).toBeInvalid();
      expect(ageInput).toHaveAccessibleDescription('Please provide a valid age.');

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('it renders as invalid when below 1', async () => {
      const onSubmit = jest.fn();

      renderForm({ onSubmit });

      const formValues = { ...buildValidFormValues, age: '0' };
      await fill(formValues);

      await userEvent.click(screen.getByRole('button', { name: SAVE_LABEL }));

      const ageInput = screen.getByLabelText(AGE_LABEL);
      expect(ageInput).toBeInvalid();
      expect(ageInput).toHaveAccessibleDescription('Please provide a valid age.');

      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
});
