import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ObjectLiteral } from '../../common/types';
import { AdminProjectPageEntity } from '../entities/admin-project-page.entity';
import { AdminProjectEntity } from '../entities/admin-project.entity';

type StoreT = AdminProjectPageEntity & {
  query: string;

  trash: ObjectLiteral<AdminProjectEntity>;
  picked: AdminProjectEntity;
};

export const AdminProjectsStore = createSlice({
  name: 'admin-projects',
  initialState: {
    page: 0,
    query: '',
    result: [],

    trash: null,
    picked: null,
  } as StoreT,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.page = 1;
      state.query = action.payload || '';
    },
    replace: (state, action: PayloadAction<AdminProjectEntity>) => {
      const index = state.result.findIndex((e) => e.id == action.payload.id);
      if (index == -1) return;

      state.result[index] = action.payload;
    },
    search: (state, action: PayloadAction<AdminProjectPageEntity>) => {
      state.result = action.payload.result;

      state.page = action.payload.page;
      state.per_page = action.payload.per_page;
      state.total = action.payload.total;
    },
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

    onPick: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.picked = state.result.find((e) => e.id == id) || null;
    },
    onReorder: (state, action: PayloadAction<AdminProjectEntity[]>) => {
      state.result = action.payload.map((e, index) => ((e.order = index), e));
    },
    onDrop: (state) => {
      state.picked = null;
    },
    onReorderSaved: (
      state,
      action: PayloadAction<AdminProjectPageEntity[]>,
    ) => {
      state.result = action.payload.map((e) => e.result).flat();
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
