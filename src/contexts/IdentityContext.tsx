import React, { useMemo, useState } from 'react';

interface IdentityContextProps {
  currentIdentity: string | null;
  setCurrentIdentity: (identity: string | null) => void;
}

export const IdentityContext = React.createContext<IdentityContextProps>({
  currentIdentity: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentIdentity: () => {},
});

export const DefaultIdentityContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentIdentity, setCurrentIdentity] = useState<string | null>(null);

  // Keep value of contexts as stable as possible
  const value = useMemo(() => ({ currentIdentity, setCurrentIdentity }), [currentIdentity]);

  return <IdentityContext.Provider value={value}>{children}</IdentityContext.Provider>;
};
