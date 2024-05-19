import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminProjectEntity } from '../entities/admin-project.entity';
import { ProjectEntity } from '../entities/project.entity';
import { ProjectTypeEnum } from '../types/project-type.enum';

type StoreT = AdminProjectEntity & {
  processing: boolean;
  readme: boolean;
};

export const AdminProjectFormStore = createSlice({
  name: 'admin-project-form',
  initialState: {
    type: ProjectTypeEnum.p5js,
    name: '',
    description: '',
    footer: '',
    readme: false,

    processing: false,
  } as StoreT,
  reducers: {
    init: (state, action: PayloadAction<AdminProjectEntity>) => {
      const res: AdminProjectEntity = action.payload as any;

      state.id = res.id;
      state.name = res.name;
      state.type = res.type;
      state.status = res.status;
      state.footer = res.footer;
      state.description = res.description;

      state.tags = res.tags;
      state.links = res.links;
      state.attachments = res.attachments;

      // state.trash = null;
      // state.picked = null;
      // state.html = '';
    },
    reset: (state) => {
      state.id = null;
    },
    setType: (state, action: PayloadAction<ProjectTypeEnum>) => {
      state.type = action.payload;
      state.link = '';
      state.readme = false;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload || '';
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload || '';
    },
    setFooter: (state, action: PayloadAction<string>) => {
      state.footer = action.payload || '';
    },
    setLink: (state, action: PayloadAction<string>) => {
      state.link = action.payload || '';
    },
    invertREADME: (state) => {
      state.readme = !state.readme;
    },
  },
  // extraReducers(builder) {
  //   builder.addCase(
  //     AdminProjectEntity.self.save.thunk.fulfilled,
  //     (_, { payload }) => {
  //       const res: ProjectEntity = payload as any;
  //       window.location.href = `./${res.id}`;
  //     },
  //   );
  // },
});
