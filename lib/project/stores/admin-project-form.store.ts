import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminProjectEntity } from '../entities/admin-project.entity';
import { ProjectEntity } from '../entities/project.entity';
import { ProjectTypeEnum } from '../types/project-type.enum';

type StoreT = Pick<
  ProjectEntity,
  'name' | 'type' | 'description' | 'footer'
> & {
  processing: boolean;
  readme: boolean;
};

export const AdminProjectFormStore = createSlice({
  name: 'admin-project-form',
  initialState: {
    type: ProjectTypeEnum.html,
    name: '',
    description: '',
    footer: '',
    readme: false,

    processing: false,
  } as StoreT,
  reducers: {
    setType: (state, action: PayloadAction<ProjectTypeEnum>) => {
      state.type = action.payload;
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
