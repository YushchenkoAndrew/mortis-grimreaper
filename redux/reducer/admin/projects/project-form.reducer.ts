import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProjectEntity } from '../../../../entities/project/project.entity';
import { ProjectStepEnum } from '../../../../entities/project/types/project-step.enum';
import { ProjectTypeEnum } from '../../../../entities/project/types/project-type.enum';

type ProjectFormStoreT = Pick<
  ProjectEntity,
  'name' | 'type' | 'description' | 'footer'
> & {
  step: ProjectStepEnum;
  processing: boolean;
  readme: boolean;
};

export const projectFormStore = createSlice({
  name: 'admin-project-form',
  initialState: {
    step: ProjectStepEnum.resources,

    type: ProjectTypeEnum.html,
    name: '',
    description: '',
    footer: '',
    readme: false,

    processing: false,
  } as ProjectFormStoreT,
  reducers: {
    setStep: (state, action: PayloadAction<ProjectStepEnum>) => {
      state.step = action.payload;
    },
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
    //   builder.addCase(LoginEntity.self.save.fulfilled, (state, { payload }) => {
    //     const res: AuthEntity = payload as any;
    //     localStorage.setItem('refresh_token', res.refresh_token);
    //     localStorage.setItem('access_token', res.access_token);
    //   });
  },
});
