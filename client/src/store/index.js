import { useContext, createContext } from 'react';

const defaultState = {
  setStatus: () => {},
  setUserName: () => {},
  setId: () => {},
  setPhoto: () => {},
  setLatitude: () => {},
  setLongitude: () => {},
};

export const AppContext = createContext(defaultState);
export const useAppContext = () => useContext(AppContext);

