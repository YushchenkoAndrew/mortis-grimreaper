import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IdEntity } from '../../common/entities/id.entity';
import { AdminDashboardCollection } from '../collections/admin-dashboard.collection';
import { DashboardCollection } from '../collections/dashboard.collection';
import { AdminStageEntity } from '../entities/admin-stage.entity';
import { StageEntity } from '../entities/stage.entity';

type StoreT = DashboardCollection & {
  // trash: StageEntity[];
  _stages: IdEntity[];
};

export const DashboardStore = createSlice({
  name: 'dashboard',
  initialState: {
    // dashboard: {},
    // trash: [],
    stages: [],
    _stages: [],

    // trash: null,
  } as StoreT,
  reducers: {
    init: (state, action: PayloadAction<DashboardCollection>) => {
      const res: DashboardCollection = action.payload as any;

      state.stages = res.stages;
      state._stages = res.stages.map((e) => new IdEntity(e));
    },
    // reload: (state, action: PayloadAction<AdminDashboardCollection>) => {
    //   const res: AdminDashboardCollection = action.payload as any;
    //   res.stages.forEach((e, index) => (state.stages[index] = e));
    // },
    setStageName: (state, action: PayloadAction<[string, string]>) => {
      const [stage_id, name] = action.payload;
      const index = state.stages.findIndex((e) => e.id == stage_id);
      if (index == -1) return;

      state.stages[index] = new StageEntity({
        ...(state.stages[index] as any),
        name,
      }) as any;
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

        // state.trash = [];
        state.stages = res.stages;
        state._stages = res.stages.map((e) => new IdEntity(e));
      },
    );
  },
});
