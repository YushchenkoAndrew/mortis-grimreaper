import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ObjectLiteral } from '../../common/types';
import { AdminProjectPageEntity } from '../entities/admin-project-page.entity';
import { AdminProjectEntity } from '../entities/admin-project.entity';

type StoreT = AdminProjectPageEntity & {
  trash: ObjectLiteral<AdminProjectEntity>;
};

export const AdminProjectsStore = createSlice({
  name: 'admin-projects',
  initialState: {
    page: 0,
    result: [],

    trash: null,
  } as StoreT,
  reducers: {
    initTrash: (state) => {
      state.trash = {};
    },
    pushTrash: (state, action: PayloadAction<AdminProjectEntity>) => {
      const id = action.payload.id;

      if (state.trash[id]) delete state.trash[id];
      else state.trash[id] = action.payload;
    },
    clearTrash: (state) => {
      state.trash = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(
      AdminProjectPageEntity.self.select.thunk.fulfilled,
      (state, { payload }) => {
        const res: AdminProjectPageEntity = payload as any;

        state.page = res.page;
        state.per_page = res.per_page;
        state.total = res.total;

        state.result.push(...res.result);
      },
    );
  },
});
