import { useEffect, useRef, type FormEventHandler } from 'react';
import Button from '../Button';

const USERNAME_ID = 'username';
const PASSWORD_ID = 'password';

export interface LoginFormProps {
  onSubmit: (data: { username?: string; password?: string }) => void;
  submitting?: boolean;
}

const LoginForm = ({ onSubmit, submitting }: LoginFormProps): JSX.Element => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { current: username } = usernameRef;

    username?.focus();
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    onSubmit({
      username: usernameRef.current?.value,
      password: passwordRef.current?.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor={USERNAME_ID} className="form-label">
          Username
        </label>
        <input id={USERNAME_ID} name="username" type="text" className="form-control" ref={usernameRef} />
      </div>

      <div className="mb-4">
        <label htmlFor={PASSWORD_ID} className="form-label">
          Password
        </label>
        <input id={PASSWORD_ID} name="username" type="password" className="form-control" ref={passwordRef} />
      </div>

      <div className="d-grid">
        <Button variant="primary" type="submit" disabled={submitting}>
          Login
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
