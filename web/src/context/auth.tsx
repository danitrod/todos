import React, { createContext, useState, useEffect, useContext } from 'react';

import UserService from 'src/services/User';

interface IAuthCtx {
  authenticated: boolean;
  name: string;
  loading: boolean;
  refresh: () => void;
}

const defaultValue: IAuthCtx = {
  authenticated: false,
  loading: false,
  name: '',
  refresh: () => undefined,
};

const AuthContext = createContext<IAuthCtx>(defaultValue);

export const AuthProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const refresh = async () => {
    setLoading(true);
    const authentication = await UserService.authenticate();
    setAuthenticated(authentication.success);
    if (authentication.success) {
      setName(authentication.name);
    }
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, name, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): IAuthCtx => useContext(AuthContext);

export default useAuth;
