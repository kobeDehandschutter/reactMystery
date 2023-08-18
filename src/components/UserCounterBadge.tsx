import { useEffect, useState } from 'react';
import { Badge } from './Badge';
import { list } from '../services/userApiClient';
import { isAbortError } from '../utils/fetcher';

const UserCounterBadge = () => {
  const [total, setTotal] = useState<number>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    const abortController = new AbortController();

    list({ pageSize: 1 }, { signal: abortController.signal })
      .then(({ total }) => setTotal(total))
      .catch((err) => {
        if (isAbortError(err)) return;

        setError(err);
      });

    return () => abortController.abort();
  }, []);

  if (error) {
    return (
      <Badge variant="danger" pill>
        Oepsie users foetsie
      </Badge>
    );
  }

  if (total === undefined) {
    return (
      <Badge variant="warning" pill>
        Counting users
      </Badge>
    );
  }

  return (
    <Badge variant="success" pill>
      {total} users
    </Badge>
  );
};

export default UserCounterBadge;
