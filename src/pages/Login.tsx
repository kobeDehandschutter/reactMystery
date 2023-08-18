import { useContext, type ComponentPropsWithoutRef, useState } from 'react';
import { IdentityContext } from '../contexts/IdentityContext';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/Login/LoginForm';
import { authenticate } from '../services/authService';
import Alert from '../components/Alert';

export const LoginPageDataTestId = 'login-page';

const Login = () => {
  const { currentIdentity, setCurrentIdentity } = useContext(IdentityContext);

  const [loginAttempts, setLoginAttempts] = useState(1);
  const [authenticating, setAuthenticating] = useState(false);
  const [authenticationFailed, setAuthenticationFailed] = useState(false);

  const onSubmit: ComponentPropsWithoutRef<typeof LoginForm>['onSubmit'] = async ({ username = '', password = '' }) => {
    setAuthenticationFailed(false);
    setAuthenticating(true);

    const result = await authenticate(username, password)
      .catch(() => setAuthenticationFailed(true))
      .finally(() => setAuthenticating(false));

    if (result) {
      setCurrentIdentity(username);
    } else {
      setAuthenticationFailed(true);
      setLoginAttempts((key) => key + 1);
    }
  };

  if (currentIdentity) return <Navigate to="/" />;

  return (
    <div data-testid={LoginPageDataTestId}>
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="card col-sm-6">
            <h4 className="card-header">Log in to Bootcamp</h4>
            <div className="card-body">
              {authenticationFailed && (
                <Alert className="text-center" variant="danger">
                  Unknown username or password
                </Alert>
              )}
              <LoginForm key={loginAttempts} onSubmit={onSubmit} submitting={authenticating} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
