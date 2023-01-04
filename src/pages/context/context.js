import React, { createContext, useContext, useReducer } from 'react';
import mainReducer from './reducer';
import useAuthentication from 'hooks/useAuthentication';

export const initStateFilters = {
  isfilterOpen: false,
  companies: [],
  projects: [],
  employees: [],
  time: '',
};

const initial_state = {
  filters: initStateFilters,
};

export const MainContext = createContext({ value: initial_state, dispatch: () => null });
MainContext.displayName = 'MainContext';

export const MainProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, initial_state);
  const { getSession, user, userLoading } = useAuthentication();

  return (
    <MainContext.Provider
      value={{
        state,
        dispatch,
        getSession,
        user,
        userLoading,
      }}
    >
      {userLoading ? <></> : children}
    </MainContext.Provider>
  );
};

const useMain = () => useContext(MainContext);

export default useMain;
