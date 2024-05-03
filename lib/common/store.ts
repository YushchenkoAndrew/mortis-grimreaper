import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from 'react-redux';
import { LoginStore } from '../auth/stores/login.store';
import { AdminProjectFormStore } from '../project/stores/admin-project-form.store';
import { AdminProjectStore } from '../project/stores/admin-project.store';
import { AdminAttachmentStore } from '../attachment/stores/admin-attachment.store';
import { ProjectsStore } from '../project/stores/projects.store';
import { AdminProjectsStore } from '../project/stores/admin-projects.store';

export const store = () => {
  return configureStore({
    reducer: {
      project: ProjectsStore.reducer,
      admin: combineReducers({
        login: LoginStore.reducer,
        attachment: AdminAttachmentStore.reducer,
        projects: AdminProjectsStore.reducer,
        project: combineReducers({
          index: AdminProjectStore.reducer,
          form: AdminProjectFormStore.reducer,
        }),
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
