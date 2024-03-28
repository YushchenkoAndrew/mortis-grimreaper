import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from 'react-redux';
import { loginStore } from './reducer/admin/login.reducer';
import { projectStore } from './reducer/project.reducer';

export const store = () => {
  return configureStore({
    reducer: {
      project: projectStore.reducer,
      admin: combineReducers({
        login: loginStore.reducer,
      }),
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export type AppStore = ReturnType<typeof store>;

export type StoreT = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<StoreT> = useSelector;
export const useAppStore: () => AppStore = useStore;
