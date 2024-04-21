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
  extraReducers(builder) {
    builder.addCase(
      AdminProjectEntity.self.save.thunk.fulfilled,
      (_, { payload }) => {
        const res: ProjectEntity = payload as any;
        window.location.href = `./${res.id}`;
      },
    );
  },
});
