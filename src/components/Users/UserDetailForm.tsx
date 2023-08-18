import { FormEventHandler, FC, useState, ChangeEventHandler, useEffect, useRef } from 'react';
import { User } from '../../services/userApiClient';
import Button from '../Button';
import styles from './UserDetailForm.module.css';

const EMAIL_REG_EX =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

type UserDetails = Pick<User, 'firstName' | 'lastName' | 'email' | 'age'>;

interface UserDetailFormProps {
  onSubmit: (user: UserDetails) => void;
}

interface FormState extends Omit<UserDetails, 'age'> {
  age: string;
}

const UserDetailForm: FC<UserDetailFormProps> = ({ onSubmit }) => {
  const [formValues, setFormValues] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserDetails, string>>>({});

  const [submitted, setSubmitted] = useState(false);

  const firstNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { current } = firstNameRef;
    current?.focus();
  }, []);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const {
      target: { id, value },
    } = event;

    switch (id) {
      case 'firstName':
      case 'lastName':
      case 'email':
      case 'age':
        setFormValues((values) => ({ ...values, [id]: value }));
        break;
      default:
        throw new Error(`Unknown form field: ${id}`);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    setSubmitted(true);

    const result = tryExtract(formValues);

    if (result.ok) {
      setErrors({});
      onSubmit(result.result);
    } else {
      setErrors(result.errors);
    }
  };

  return (
    <form name="user-detail" className="row g-3" noValidate onSubmit={handleSubmit}>
      <div className="col-md-6">
        <label htmlFor="firstName" className="form-label">
          First name
        </label>
        <input
          type="text"
          className="form-control"
          id="firstName"
          ref={firstNameRef}
          value={formValues.firstName}
          onChange={handleChange}
          aria-invalid={submitted && Boolean(errors.firstName)}
          aria-describedby="firstname-validation-feedback"
        />
        {submitted && errors.firstName && (
          <div className={styles['validation-error']} id="firstname-validation-feedback">
            {errors.firstName}
          </div>
        )}
      </div>
      <div className="col-md-6">
        <label htmlFor="lastName" className="form-label">
          Last name
        </label>
        <input
          type="text"
          className="form-control"
          id="lastName"
          value={formValues.lastName}
          onChange={handleChange}
          aria-invalid={submitted && Boolean(errors.lastName)}
          aria-describedby="lastname-validation-feedback"
        />
        {submitted && errors.lastName && (
          <div className={styles['validation-error']} id="lastname-validation-feedback">
            {errors.lastName}
          </div>
        )}
      </div>
      <div className="col-md-6">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="text"
          className="form-control"
          id="email"
          value={formValues.email}
          onChange={handleChange}
          aria-invalid={submitted && Boolean(errors.email)}
          aria-describedby="email-validation-feedback"
        />
        {submitted && errors.email && (
          <div className={styles['validation-error']} id="email-validation-feedback">
            {errors.email}
          </div>
        )}
      </div>
      <div className="col-md-4">
        <label htmlFor="age" className="form-label">
          Age
        </label>
        <input
          type="number"
          className="form-control"
          id="age"
          value={formValues.age}
          onChange={handleChange}
          aria-invalid={submitted && Boolean(errors.age)}
          aria-describedby="age-validation-feedback"
        />
        {submitted && Boolean(errors.age) && (
          <div className="validation-error" id="age-validation-feedback">
            {errors.age}
          </div>
        )}
      </div>

      <div className="col-12 mt-4">
        <Button variant="primary" type="submit">
          Save
        </Button>
      </div>
    </form>
  );
};

interface Ok<T> {
  ok: true;
  result: T;
}

interface NotOk<T> {
  ok: false;
  errors: T;
}

type Result<TOk, TNOk> = Ok<TOk> | NotOk<TNOk>;

function tryExtract(formState: FormState): Result<UserDetails, Partial<Record<keyof FormState, string>>> {
  const errors: Partial<Record<keyof FormState, string>> = {};

  if (!formState.firstName) errors.firstName = 'Please enter a firstname.';
  if (!formState.lastName) errors.lastName = 'Please enter a lastname.';
  if (!formState.email) errors.email = 'Please enter an email.';
  else if (!EMAIL_REG_EX.test(formState.email)) errors.email = 'Please provide a valid email.';

  let numericAge: number | null = null;

  if (formState.age) {
    numericAge = Number(formState.age);

    if (Number.isNaN(numericAge) || numericAge < 1 || numericAge !== Math.floor(numericAge))
      errors.age = 'Please provide a valid age.';
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const { age, ...rest } = formState;

  const result: UserDetails = {
    ...rest,
    ...(numericAge && { age: numericAge }),
  };

  return {
    ok: true,
    result,
  };
}

export default UserDetailForm;
