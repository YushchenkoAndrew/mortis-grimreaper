import { createSlice } from '@reduxjs/toolkit';
import { PageType, QueryType } from '../../captcha/types/request.type';
import { ProjectPageEntity } from '../entities/project-page.entity';
import { ProjectEntity } from '../entities/project.entity';

type StoreT = Pick<ProjectPageEntity, 'total' | 'page'> & {
  query: PageType & QueryType;

  projects: ProjectEntity[];
};

export const ProjectStore = createSlice({
  name: 'project',
  initialState: { query: {}, total: 0, page: 0, projects: [] } as StoreT,
  reducers: {
    // invertMode: (state) => {
    //   state.mode = State2Mode(!state.mode.state);
    // },
  },
  extraReducers(builder) {
    builder.addCase(
      ProjectPageEntity.self.select.thunk.fulfilled,
      (state, { payload }) => {
        const res: ProjectPageEntity = payload as any;
        // state.query = payload.options;

        state.page = res.page;
        state.total = res.total;
        res.result.forEach((e) => state.projects.push(e));
      },
    );
  },
});
