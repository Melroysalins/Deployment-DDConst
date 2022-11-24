import React from 'react';

const Store = React.createContext();
Store.displayName = 'Store';

export const useStore = () => React.useContext(Store);

export const StoreProvider = ({ children }) => {
  // Complete User Data
  const [actionFunction, setActionFunction] = React.useState(() => {});

  return (
    <Store.Provider
      value={{
        actionFunction,
        setActionFunction,
      }}
    >
      {children}
    </Store.Provider>
  );
};
