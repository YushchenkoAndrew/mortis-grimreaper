import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContextFieldEntity } from '../../context/entities/context-field.entity';
import { TaskEntity } from '../entities/task.entity';

type StoreT = TaskEntity & {
  stage_id: string;
  // dashboard: ObjectLiteral<AdminStageEntity>;

  fields: ContextFieldEntity[];
};

export const TaskFormStore = createSlice({
  name: 'task-form',
  initialState: {
    stage_id: '',

    fields: [],
  } as StoreT,
  reducers: {
    init: (state, action: PayloadAction<[string, TaskEntity]>) => {
      const [stage_id, res]: [string, TaskEntity] = action.payload as any;
      state.stage_id = stage_id;

      state.id = res.id;
      state.name = res.name || '';
      state.description = res.description || '';

      state.tags = res.tags;
      state.owner = res.owner;
      state.attachments = res.attachments;
      state.contexts = res.contexts;

      state.links = res.links.concat(null);
      // .concat(
      //   res.id == 'null' ? new AdminLinkEntity({ name: '', link: '' }) : null,
      // );

      const ctx = res.contexts?.[0];
      state.fields = (ctx?.fields ?? [])
        .map((e) => ((e.context_id = ctx.id), e))
        .concat(null);
    },
    reset: (state) => {
      state.id = null;
      // state.name = '';
      // state.description = '';
      // state.status = TaskStatusEnum.active;

      // state.tags = [];
      // state.links = [];
    },
    setId: (state, action: PayloadAction<[string, string]>) => {
      [state.stage_id, state.id] = action.payload || [];
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
