import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminStageEntity } from '../entities/admin-stage.entity';
import { StageStatusEnum } from '../types/stage-status.enum';

type StoreT = AdminStageEntity & {
  // trash: ObjectLiteral<AdminProjectEntity>;
  // dashboard: ObjectLiteral<AdminStageEntity>;
};

export const AdminStageFormStore = createSlice({
  name: 'admin-stage-form',
  initialState: {
    // dashboard: {},
    // stages: [],
    // trash: null,
  } as StoreT,
  reducers: {
    init: (state, action: PayloadAction<AdminStageEntity>) => {
      const res: AdminStageEntity = action.payload as any;
      // state.stages = res.stages;

      state.id = res.id;
      state.name = res.name;
      state.status = res.status;
    },
    reset: (state) => {
      state.id = null;
      state.name = '';
      state.status = StageStatusEnum.active;
    },
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload || null;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = (action.payload || '').toUpperCase();
    },
  },
  // extraReducers(builder) {
  //   builder.addCase(
  //     AdminDashboardCollection.self.select.thunk.fulfilled,
  //     (state, { payload }) => {
  //       const res: AdminDashboardCollection = payload as any;
  //       state.stages = res.stages;
  //     },
  //   );
  // },
});
