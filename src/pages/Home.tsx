import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IdentityContext } from '../contexts/IdentityContext';
import useTranslation from '../hooks/useTranslation';
import useFetch from '../hooks/useFetch';
import { User } from '../services/userApiClient';

export const HomePageDataTestId = 'home-page';

const Home = () => {
  const [counter, setCounter] = useState(1)
  const t = useTranslation('nl');
  const {data, isLoading, error} = useFetch<User>(process.env.REACT_APP_API_BASE_URL + "/users/" + counter)
  const { currentIdentity } = useContext(IdentityContext);

  const changeUrlHandler = () => {
    setCounter(c => c+1)
  }

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
      {isLoading && <p>LOADING...</p>}
      {error && <p>ERROR - {error.message}</p>}

     {data !== null && (
     <div data-testid="data">
          {data.firstName}
      </div>
      )}

      <button onClick={changeUrlHandler}>change url</button>
    </div>
  );
};

export default Home;
