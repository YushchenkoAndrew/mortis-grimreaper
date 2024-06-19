import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { DeepEntity, ObjectLiteral } from '../../common/types';
import { AdminProjectPageEntity } from '../entities/admin-project-page.entity';
import { AdminProjectEntity } from '../entities/admin-project.entity';

type StoreT = AdminProjectPageEntity & {
  request_id: string;
  query: string;

  picked: string;
  trash: ObjectLiteral<AdminProjectEntity>;
};

export const AdminProjectsStore = createSlice({
  name: 'admin-projects',
  initialState: {
    request_id: null,
    page: 0,
    query: null,

    result: [],

    trash: null,
    picked: null,
  } as StoreT,
  reducers: {
    init: (state, action: PayloadAction<AdminProjectPageEntity>) => {
      state.page = action.payload.page;
      state.per_page = action.payload.per_page;
      state.total = action.payload.total;

      state.result = action.payload.result;
    },
    push: (state, action: PayloadAction<AdminProjectPageEntity>) => {
      state.page = action.payload.page;
      state.per_page = action.payload.per_page;
      state.total = action.payload.total;

      state.result.push(...action.payload.result);
    },
    setPage: (state, action: PayloadAction<number>) => {
      if (state.result.length >= state.total) return;

      state.page = action.payload;
      state.request_id = uuid();
    },
    setQuery: (state, action: PayloadAction<string>) => {
      [state.page, state.query] = [1, action.payload];
      state.request_id = uuid();
    },
    replace: (state, action: PayloadAction<AdminProjectEntity>) => {
      const index = state.result.findIndex((e) => e.id == action.payload.id);
      if (index == -1) return;

      state.result[index] = action.payload;
    },
    initTrash: (state) => {
      state.trash = {};
    },
    pushTrash: (
      state,
      action: PayloadAction<DeepEntity<AdminProjectEntity>>,
    ) => {
      const id = action.payload.id;

      if (state.trash[id]) delete state.trash[id];
      else state.trash[id] = action.payload;
    },
    clearTrash: (state) => {
      state.trash = null;
    },

    onPick: (state, action: PayloadAction<string>) => {
      state.picked = action.payload;
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
    // builder.addCase(
    //   AdminProjectPageEntity.self.select.thunk.fulfilled,
    //   (state, { payload }) => {
    //     const res: AdminProjectPageEntity = payload as any;
    //     state.page = res.page;
    //     state.per_page = res.per_page;
    //     state.total = res.total;
    //     state.result.push(...res.result);
    //   },
    // );
  },
});
