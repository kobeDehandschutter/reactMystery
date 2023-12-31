import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { IdentityContext } from '../contexts/IdentityContext';
import useTranslation from '../hooks/useTranslation';
import useFetch from '../hooks/useFetch';
import { User } from '../services/userApiClient';

export const HomePageDataTestId = 'home-page';

const Home = () => {
  const [counter, setCounter] = useState<number>(1)
  const t = useTranslation('nl');
  const {data, isLoading, error, mutate} = useFetch<User>(process.env.REACT_APP_API_BASE_URL + "/users/" + counter, {initialValue: {
    id: 1,
    email: "init",
    firstName: "firstname",
    lastName: "lastname"
  }})
  const {data: dataList, isLoading: listIsLoading, error: listError} = useFetch<User[]>(process.env.REACT_APP_API_BASE_URL + "/users?_page=" + counter)
  const { currentIdentity } = useContext(IdentityContext);

  const changeUrlHandler = () => {
    setCounter((c) => c + 1);
  };

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

     {(data !== null && !error && !isLoading) && (
     <p data-testid="data">
          {data.firstName} {data.lastName}
      </p>
      )}

      <button onClick={changeUrlHandler}>change url</button>
      <button onClick={mutate}>refresh</button>

      <br/>
      <br/>
      <br/>
      <br/>

      {listIsLoading && <p>Load list</p>}
      {listError && <p>Err LIST - {listError.message}</p>}
      {(dataList !== null && !listError && !listIsLoading) && dataList.map(t => <p key={t.id}>{t.firstName}</p>)}

    </div>
  );
};

export default Home;
