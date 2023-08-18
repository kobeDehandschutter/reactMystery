import { ComponentProps } from 'react';
import { useParams } from 'react-router-dom';
import UserDetailForm from '../components/Users/UserDetailForm';

export const UserDetailPageDataTestId = 'login-page';

const UserDetail = () => {
  const { id } = useParams();

  const handleSubmit: ComponentProps<typeof UserDetailForm>['onSubmit'] = (user) => {
    console.log(user);
  };

  return (
    <div data-testid={UserDetailPageDataTestId} data-userid={id}>
      <h1>User Detail</h1>

      <UserDetailForm onSubmit={handleSubmit} />
    </div>
  );
};

export default UserDetail;
