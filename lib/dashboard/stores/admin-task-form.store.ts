import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminTaskEntity } from '../entities/admin-task.entity';
import { TaskStatusEnum } from '../types/task-status.enum';

type StoreT = AdminTaskEntity & {
  stage_id: string;
  // trash: ObjectLiteral<AdminProjectEntity>;
  // dashboard: ObjectLiteral<AdminStageEntity>;
};

export const AdminTaskFormStore = createSlice({
  name: 'admin-task-form',
  initialState: {
    stage_id: '',
    // dashboard: {},
    // stages: [],
    // trash: null,
  } as StoreT,
  reducers: {
    init: (state, action: PayloadAction<AdminTaskEntity>) => {
      const res: AdminTaskEntity = action.payload as any;
      // state.stages = res.stages;

      state.id = res.id;
      state.name = res.name;
      state.status = res.status;
    },
    reset: (state) => {
      state.id = null;
      state.name = '';
      state.status = TaskStatusEnum.active;
    },
    setId: (state, action: PayloadAction<[string, string]>) => {
      [state.stage_id, state.id] = action.payload || [];
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload || '';
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
