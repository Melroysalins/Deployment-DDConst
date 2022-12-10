import React, { createContext, useContext, useReducer } from 'react';
import teReducer from './reducer';
import data from '../data.json';

const initial_state = {
  events: [],
  resources: [],
};

export const TEContext = createContext({ value: initial_state, dispatch: () => null });
TEContext.displayName = 'TEContext';

export const TEProvider = ({ children }) => {
  const [state, dispatch] = useReducer(teReducer, initial_state);
  return (
    <TEContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </TEContext.Provider>
  );
};

const useTE = () => useContext(TEContext);

export default useTE;
