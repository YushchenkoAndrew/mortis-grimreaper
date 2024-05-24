import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ObjectLiteral } from '../../common/types';
import { AdminDashboardCollection } from '../collections/admin-dashboard.collection';
import { AdminStageEntity } from '../entities/admin-stage.entity';

type StoreT = AdminDashboardCollection & {
  // trash: ObjectLiteral<AdminProjectEntity>;
  // dashboard: ObjectLiteral<AdminStageEntity>;
};

export const AdminDashboardStore = createSlice({
  name: 'admin-dashboard',
  initialState: {
    // dashboard: {},
    stages: [],
    // trash: null,
  } as StoreT,
  reducers: {
    init: (state, action: PayloadAction<AdminDashboardCollection>) => {
      const res: AdminDashboardCollection = action.payload as any;
      state.stages = res.stages;
    },
    // reload: (state, action: PayloadAction<AdminDashboardCollection>) => {
    //   const res: AdminDashboardCollection = action.payload as any;
    //   res.stages.forEach((e, index) => (state.stages[index] = e));
    // },
    setStageName: (state, action: PayloadAction<[string, string]>) => {
      const [stage_id, name] = action.payload;
      const index = state.stages.findIndex((e) => e.id == stage_id);
      if (index != -1) state.stages[index].name = name;
    },
    // replace: (state, action: PayloadAction<AdminProjectEntity>) => {
    //   const index = state.result.findIndex((e) => e.id == action.payload.id);
    //   if (index == -1) return;
    //   state.result[index] = action.payload;
    // },
    // search: (state, action: PayloadAction<AdminProjectPageEntity>) => {
    //   state.result = action.payload.result;
    //   state.page = action.payload.page;
    //   state.per_page = action.payload.per_page;
    //   state.total = action.payload.total;
    // },
    onReorder: (state, action: PayloadAction<AdminStageEntity[]>) => {
      state.stages = action.payload.map((e, index) => ((e.order = index), e));
    },
    // onReorderSaved: (
    //   state,
    //   action: PayloadAction<AdminProjectPageEntity[]>,
    // ) => {
    //   state.result = action.payload.map((e) => e.result).flat();
    // },
  },
  extraReducers(builder) {
    builder.addCase(
      AdminDashboardCollection.self.select.thunk.fulfilled,
      (state, { payload }) => {
        const res: AdminDashboardCollection = payload as any;
        state.stages = res.stages;
      },
    );
  },
});
