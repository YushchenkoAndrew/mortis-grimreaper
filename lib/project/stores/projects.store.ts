import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { NumberService } from '../../common';
import { ProjectPageEntity } from '../entities/project-page.entity';

type StoreT = ProjectPageEntity & {
  random: number;
};

export const ProjectsStore = createSlice({
  name: 'project',
  initialState: { page: 0, result: [] } as StoreT,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      ProjectPageEntity.self.select.thunk.fulfilled,
      (state, { payload }) => {
        const res: ProjectPageEntity = payload as any;

        state.page = res.page;
        state.per_page = res.per_page;
        state.total = res.total;

        state.result.push(...res.result);

        const seed = NumberService.seed(moment().startOf('day').unix() + '');
        state.random = Math.floor(seed * state.total);
      },
    );
  },
});
