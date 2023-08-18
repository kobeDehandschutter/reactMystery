import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { IdentityContext } from '../contexts/IdentityContext';
import useTranslation from '../hooks/useTranslation';

export const HomePageDataTestId = 'home-page';

const Home = () => {
  const t = useTranslation('nl');
  const { currentIdentity } = useContext(IdentityContext);

  return (
    <div data-testid={HomePageDataTestId}>
      <h1>{t('home.title')}</h1>
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
