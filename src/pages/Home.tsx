import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { IdentityContext } from '../contexts/IdentityContext';

export const HomePageDataTestId = 'home-page';

const Home = () => {
  const { currentIdentity } = useContext(IdentityContext);

  return (
    <div data-testid={HomePageDataTestId}>
      <h1>Home</h1>
      <p>
        {currentIdentity ? (
          <>Welcome, {currentIdentity}</>
        ) : (
          <>
            Please <Link to="/login">login</Link>
          </>
        )}
      </p>
    </div>
  );
};

export default Home;
